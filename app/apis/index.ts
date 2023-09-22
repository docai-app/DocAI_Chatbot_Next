// index.js
import Chatbot from './Chatbot';
import Classification from './Classification';
import Search from './Search';
import Storage from './Storage';
import Tag from './Tag';

export default class Api {
    Chatbot: Chatbot;
    Storage: Storage;
    Tag: Tag;
    Search: Search;
    Classification: Classification;

    constructor() {
        this.Chatbot = new Chatbot();
        this.Storage = new Storage();
        this.Tag = new Tag();
        this.Search = new Search();
        this.Classification = new Classification();
    }
}
