var budgetController = (function () {
    function Expense(value , description , id){
        this.id = id;
        this.value = value;
        this.description = description;
    }

    function Income(value , description , id){
        this.id = id;
        this.value = value;
        this.description = description;
    }

    var data = {
        allitems : {
            inc : [],
            exp : []
        },
        totals : {
            inc : 0,
            exp : 0
        }
    }

    return {
        AddItem : (type , des , val) => {
            var newItem , ID;
            if(data.allitems[type].length > 0){
                ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }
            if(type === 'exp'){
                newItem = new Expense(ID , des , val);
            }
            else if(type === 'inc'){
                newItem = new Income(ID , des , val);
            }
            data.allitems[type].push(newItem);
            return newItem;
        } 
    };

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
    
    function SetupEventListeners(){
        var DOM = UICtrl.GetDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click' ,HandleAddBtnClickEvent);    
        document.addEventListener('keypress' , (event) => {
            if(event.key === "Enter" || event.which === 13){
                HandleAddBtnClickEvent();
            }
        });

    }
    

    function HandleAddBtnClickEvent(){
        var input , newItem;
        input = UICtrl.GetInput();
        newItem = budgetCtrl.AddItem(input.type , input.description , input.value)
    }

    return {
        init : () => {
            SetupEventListeners();
        }
    }


})(budgetController , UIController);