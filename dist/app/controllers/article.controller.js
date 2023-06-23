"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticles = exports.embedArticles = exports.getAllArticles = exports.addNewArticle = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const text_splitter_1 = require("langchain/text_splitter");
const openai_1 = require("langchain/embeddings/openai");
const article_model_1 = require("../models/article.model");
const config_1 = require("../config");
const addNewArticle = (req, res) => {
    const newArticle = {
        title: req.body.title,
        content: req.body.content,
        embeded: false,
        date: new Date(),
        author: parseInt(req.body.userid),
    };
    article_model_1.Article.create(newArticle)
        .then((data) => {
        res.json({ success: true, message: "Article added successfully" });
    })
        .catch((err) => {
        console.log(err);
        res.json({ success: false, message: "Database Connection Error" });
    });
};
exports.addNewArticle = addNewArticle;
const getAllArticles = (req, res) => {
    const query = {
        where: {
            author: {
                [sequelize_1.Op.eq]: parseInt(req.body.userid),
            },
        },
    };
    article_model_1.Article.findAll(query)
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
exports.getAllArticles = getAllArticles;
// Embeding Articles
const embedArticleContent = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("00000000", data);
    try {
        const documentId = (0, uuid_1.v4)();
        const splitter = new text_splitter_1.MarkdownTextSplitter();
        const splittedTexts = yield splitter.splitText(data); // Split the Markdown Text
        console.log("cccccccc", splittedTexts);
        const embeddings = new openai_1.OpenAIEmbeddings(); // Get OpenAI Embeddings By Splitted Text
        console.log("dddddddd");
        const vectors = yield embeddings.embedDocuments(splittedTexts); // Get vectors by splitted texts
        console.log("eeeeeeeeee");
        var ids = [];
        console.log(22222222222, vectors);
        // ---------- Merge the Embedding Vector data as a Pinecone data ----------
        const documentVectors = splittedTexts.map((item, i) => {
            const id = `p-${(0, uuid_1.v4)()}`;
            ids.push(id);
            return {
                id: id,
                values: vectors[i],
                metadata: {
                    docId: documentId,
                    [config_1.PINECONE_TEXT_KEY]: item,
                },
            };
            console.log(3333333333, documentVectors);
        });
        // ------------------------------------------------------------------------
    }
    catch (err) { }
});
const embedArticleData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    data.filter((item) => {
        embedArticleContent(item.dataValues.content);
    });
});
const embedArticles = (req, res) => {
    const idList = req.body.articleIds;
    const query = {
        where: {
            id: {
                [sequelize_1.Op.in]: idList,
            },
        },
    };
    article_model_1.Article.findAll(query)
        .then((data) => {
        embedArticleData(data);
    })
        .catch((err) => {
        console.log(err);
    });
    article_model_1.Article.update({ embeded: true }, query)
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
exports.embedArticles = embedArticles;
// Delete Articles
const deleteArticles = (req, res) => {
    const idList = req.body.articleIds;
    const query = {
        where: {
            id: {
                [sequelize_1.Op.in]: idList,
            },
        },
    };
    article_model_1.Article.destroy(query)
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
exports.deleteArticles = deleteArticles;
