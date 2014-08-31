/*******************************************************************************
 * used in user side.
 ******************************************************************************/

var numViewMore=1;
var drugInteractDataList = [];
var orderItemList = [];
var productAttrCombinations = {};
var interactionResultStatus = {
    successWithInteraction: 1,
      successWithoutInteraction: 2,
    failureInteraction: 3
};
var searchBarCategories = {
  'drugs' : 'Matching Drugs/Products',
  'OTC' : 'Matching Drugs/Products',
  'generics' : 'Matching Salts',
  'brand' : 'Matching Brands'
}
var interactionKeys = {
    4:{
        type:'lil',
        name:'VERY LOW INTERACTION',
        imgSrc:'/images/little-interaction.png',
        size: 0
    },
    3:{
        type:'low',
        name:'LOW INTERACTION',
        imgSrc:'/images/low-interaction.png',
        size: 0
    },
    2:{
        type:'med',
        name:'MEDIUM INTERACTION',
        imgSrc:'/images/medium-interaction.png',
        size: 0
    },
    1:{
        type:'high',
        name:'HIGH INTERACTION',
        imgSrc:'/images/high-interaction.png',
        size: 0
    },
    5:{
        type:'gen',
        name:'ALL INTERACTIONS',
        imgSrc:null ,
        size: 0
    },
    6:{
        type:'no',
        name:'NO INTERACTION',
        imgSrc:null ,
        size: 0
    }
};

var gamePlay = {
    addToCartCheckBoxSelection : function(obj){

    },
    initSearchBar : function(){

    }
};