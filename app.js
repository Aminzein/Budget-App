var budgetController = (function () {


})();

var UIController = (function () {
    var DOMstrings = {
        inputType : '.add__type' ,
        inputDescription : '.add__description' , 
        inputValue : '.add__value' ,
        inputButton : '.add__btn'
    };
    
    return {
        GetInput : () => {
            return {
                type : document.querySelector(DOMstrings.inputType).value, // inc or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            };
        } ,
        GetDOMstrings : () => {
            return DOMstrings;
        }
    };
})();


var AppController = (function (budgetCtrl , UICtrl) {
    var DOM = UICtrl.GetDOMstrings();

    function HandleAddBtnClickEvent(){
        var input = UICtrl.GetInput();
        console.log(input); 
    }

    document.querySelector(DOM.inputButton).addEventListener('click' ,HandleAddBtnClickEvent);    
    document.addEventListener('keypress' , (event) => {
        if(event.key === "Enter" || event.which === 13){
            HandleAddBtnClickEvent();
        }
    });

})(budgetController , UIController);