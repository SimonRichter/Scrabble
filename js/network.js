import Store from 'https://network-lite.nodehill.com/store';
import Board from "./Board.js";

export default class Network {

  constructor() {
    //this.renderStart();
    //this.addEventListeners();
  }


  async whatever() {
    this.networkKey = await Store.createNetworkKey();
    console.log(this.networkKey);
    // this.connectToStore();
  }



}