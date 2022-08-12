'use strict';


class Node {
  constructor(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  add(data) {
    const node = this.root;
    if (node === null) {
      this.root = new Node(data);
      return;
    } else {
      const searchTree = function(node) {
        if (data < node.data) {
          if (node.left === null) {
            node.left = new Node(data);
            return;
          } else if (node.left !== null) {
            return searchTree(node.left);
          }
        } else if (data > node.data) {
          if (node.right === null) {
            node.right = new Node(data);
            return;
          } else if (node.right !== null) {
            return searchTree(node.right);
          }
        } else {
          return null;
        }
      };
      return searchTree(node);
    }
  }
  findMin() {
    let current = this.root;
    while (current.left !== null) {
      current = current.left;
    }
    return current.data;
  }
  findMax() {
    let current = this.root;
    while (current.right !== null) {
      current = current.right;
    }
    return current.data;
  }

  inOrder() {
    if (this.root == null) {
      return null;
    } else {
      var result = new Array();
      function traverseInOrder(node) {       
        node.left && traverseInOrder(node.left);
        result.push(node.data);
        node.right && traverseInOrder(node.right);
      }
      traverseInOrder(this.root);
      return result;
    };
  }
  
}


function request(method,url) {
    return new Promise(function (resolve,reject){
        let xhr = new XMLHttpRequest();
        xhr.open(method,url);
        xhr.onload=resolve;
        xhr.onerror =reject;
        xhr.send();
        
    });
};

// function setLocalStorage(){
//   localStorage.setItem('Btc Values', JSON.stringify());
// };



const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
const bst = new BST();
let btcToUsd;
let yourUsd = 60000;
let yourBtc = 400;

const loadBtc = async function () {
  try {
    request('GET','there will be enpoint').then((r1) => {
    const valueofText = JSON.parse(r1.target.responseText);
    btcToUsd =valueofText.data[1].quote.USD;
    return btcToUsd;
   }).then((btcToUsd)=>{
    const hour24 = btcToUsd.percent_change_24h;
    const hour1 = btcToUsd.percent_change_1h;
    const priceU = btcToUsd.price;
    console.log(btcToUsd);
    const lPredictedValue = (((priceU*hour24/100)+priceU)+((priceU*hour1/100)+priceU))/2;//saçma bir kural yazdım.genelde sol node geçer bu çünkü son zamanlarda hep artıyor. ama azalır da saatlik veriden oran.
    const sPredictedValue = (priceU*hour1/100)+priceU;
    //az çok ve btc şu an ki değeğrlerini binary tree atıyoruz.
    bst.add(priceU);
    bst.add(lPredictedValue);
    bst.add(sPredictedValue);
    console.log(priceU);
    return bst;
   })
    
  await (async function AlSatConditions(){await timeout(2000);
    console.log(bst.inOrder());
    
    if(yourBtc && bst.root.data<=bst.root.right?.right?.data) {
      //yourUsd= yourUsd+(yourBtc/10);btc den usd dönüşüm olmalı
      yourBtc= yourBtc-(yourBtc/10);
    } else if(yourUsd && bst.root.data>=bst.root.left?.left?.data){
      //yourBtc=yourBtc+(yourUsd/10);btc den usd dönüşüm olmalı
      yourUsd= yourUsd-(yourUsd/10);
    }else console.log('değişiklik yok');
    console.log(bst.inOrder());
    console.log(yourBtc);
    console.log(yourUsd);
  AlSatConditions();
  })();

  
 
   
  } catch (err) {
    console.error(err);
  }
};
(async() => await loadBtc())();



