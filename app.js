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

    function SetID(type){
        var ID;
        if(data.allitems[type].length > 0){
            ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
        }
        else {
            ID = 0;
        }
        return ID;    
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
            ID = SetID(type);
            if(type === 'exp'){
                newItem = new Expense(val , des , ID);
            }
            else if(type === 'inc'){
                newItem = new Income(val , des , ID);
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
        inputButton : '.add__btn' , 
        incomeContainer : '.income__list' , 
        expensesContainer : '.expenses__list'
    };
    
    return {
        GetInput : () => {
            return {
                type : document.querySelector(DOMstrings.inputType).value, // inc or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            };
        } ,

        AddListItem : (obj , type) => {
            var html , element;
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-' + obj.id + '"><div class="item__description">' + obj.description + '</div><div class="right clearfix"><div class="item__value">' + obj.value + '</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-' + obj.id + '"><div class="item__description">' + obj.description + '</div><div class="right clearfix"><div class="item__value">' + obj.value + '</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            document.querySelector(element).insertAdjacentHTML('beforeend' , html);
        },

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
        newItem = budgetCtrl.AddItem(input.type , input.description , input.value);
        console.log(newItem);
        UICtrl.AddListItem(newItem , input.type);
    }

    return {
        init : () => {
            SetupEventListeners();
        }
    }


})(budgetController , UIController);

AppController.init();