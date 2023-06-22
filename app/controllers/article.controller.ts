import { Request, Response } from "express";
import { Op } from "sequelize";
import "@tensorflow/tfjs-backend-cpu";
import * as tf from "@tensorflow/tfjs";
import { TensorFlowEmbeddings } from "langchain/embeddings/tensorflow";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Article } from "../models/article.model";
import { VectorData } from "../models/vectordata.model";

export const addNewArticle = (req: Request, res: Response) => {
  const newArticle = {
    title: req.body.title,
    content: req.body.content,
    plainText: req.body.plainText,
    embeded: false,
    date: new Date(),
    author: parseInt(req.body.userid),
  };

  Article.create(newArticle)
    .then((data) => {
      res.json({ success: true, message: "Article added successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "Database Connection Error" });
    });
};

export const getAllArticles = (req: Request, res: Response) => {
  const query = {
    where: {
      author: {
        [Op.eq]: parseInt(req.body.userid),
      },
    },
  };

  Article.findAll(query)
    .then((data) => {
      res.json({ success: true, data: data });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: "Some error occurred while finding articles.",
      });
    });
};

// Embeding Articles

const embedArticleContent = async (articleId: any, data: any) => {
  try {
    const splitter = new MarkdownTextSplitter();
    const splittedTexts: string[] = await splitter.splitText(data); // Split the Markdown Text
    const embeddings: OpenAIEmbeddings = new OpenAIEmbeddings(); // Get OpenAI Embeddings By Splitted Text
    const vectors: number[][] = await embeddings.embedDocuments(splittedTexts); // Get vectors by splitted texts

    // ---------- Merge the Embedding Vector data as a Pinecone data ----------
    const documentVectors = splittedTexts.map((item: string, i: number) => {
      return {
        values: vectors[i],
        text: item,
        metadata: {
          articleId: articleId,
        },
      };
    });

    // ------------------------------------------------------------------------

    // ---------- Store documentVectors to Postgre ----------

    documentVectors.filter((item: any) => {
      const newVectorData = {
        articleId: item.metadata.articleId,
        text: item.text,
        data: JSON.stringify(item),
      };
      VectorData.create(newVectorData)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (err) {
    console.log(err);
  }
};

const embedArticleData = async (data: any) => {
  data.filter(async (item: any) => {
    await embedArticleContent(item.dataValues.id, item.dataValues.plainText);
  });
};

export const embedArticles = (req: Request, res: Response) => {
  const idList = req.body.articleIds;
  const query = {
    where: {
      id: {
        [Op.in]: idList,
      },
    },
  };

  Article.findAll(query)
    .then(async (data) => {
      await embedArticleData(data);
    })
    .catch((err) => {
      console.log(err);
    });

  Article.update({ embeded: true }, query)
    .then((data) => {
      res.json({ success: true, message: "successfully embeded" });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: "Some error occurred while embeding articles",
      });
    });
};

// Delete Articles

export const deleteArticles = (req: Request, res: Response) => {
  const idList = req.body.articleIds;
  const query = {
    where: {
      id: {
        [Op.in]: idList,
      },
    },
  };

  Article.destroy(query)
    .then((data) => {
      res.json({ success: true, message: "Successfully deleted" });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: "Some error occurred while deleting articles",
      });
    });
};

export const findReferenceArticles = async (vectors: any, data: any) => {
  let topRank: Array<{ similarityTotal: number; articleId: number }> = [];

  data.filter((item: any) => {
    const compareVecData = JSON.parse(item.data).values;
    let similarityTotal: number = 0;

    vectors.filter((vecItem: any) => {
      const a = tf.tensor(compareVecData);
      const b = tf.tensor(vecItem);
      let cosine = tf.losses.cosineDistance(a, b, 0);
      const oneTensor = tf.onesLike(cosine);
      const similarity = oneTensor.sub(cosine);
      const similarityValue = similarity.arraySync();
      similarityTotal += Number(similarityValue);
    });
    const filterList = topRank.filter((itm) => itm.articleId == item.articleId);
    if (filterList.length) {
      filterList[0].similarityTotal =
        filterList[0].similarityTotal > similarityTotal
          ? filterList[0].similarityTotal
          : similarityTotal;
    } else topRank.push({ similarityTotal, articleId: item.articleId });
  });
  topRank.sort((a, b) => b.similarityTotal - a.similarityTotal);
  return topRank;
};

export const findReference = async (req: Request, res: Response) => {
  const refStr = req.body.refStr;
  try {
    const splitter = new MarkdownTextSplitter();
    const splittedTexts: string[] = await splitter.splitText(refStr); // Split the Markdown Text
    const embeddings: OpenAIEmbeddings = new OpenAIEmbeddings(); // Get OpenAI Embeddings By Splitted Text
    const vectors: number[][] = await embeddings.embedDocuments(splittedTexts); // Get vectors by splitted texts

    VectorData.findAll()
      .then(async (data) => {
        const resRefArr = await findReferenceArticles(vectors, data);
        const articleIdArray = resRefArr
          .map((item) => {
            return item.articleId;
          })
          .slice(0, 5);

        const query = {
          where: {
            embeded: {
              [Op.eq]: true,
            },
          },
        };

        Article.findAll(query)
          .then((data) => {
            let result: any = [];
            articleIdArray.map((item: number) => {
              data.map((element: any) => {
                if (element.id == item) {
                  result.push(element);
                }
              });
            });
            res.json({ success: true, data: result });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};
