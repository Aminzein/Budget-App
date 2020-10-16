var budgetController = (function () {
    function Expense(value , description , id){
        this.id = id;
        this.value = value;
        this.description = description;
        this.percentage = -1;
    }

    Expense.prototype.CalcPercentage = function (totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }
        else {
            this.percentage = -1;
        }
    }

    Expense.prototype.GetPercentage = function () {
        return this.percentage;
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

    function CalculateTotal(type) {
        var sum = 0;
        data.allitems[type].forEach(element => {
            sum += element.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allitems : {
            inc : [],
            exp : []
        },
        totals : {
            inc : 0,
            exp : 0
        } ,
        budget : 0 ,
        percentage : -1
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
        } ,

        DeleteItem : (type , id) => {
            var ids , index;
            ids = data.allitems[type].map(element => {
                return element.id;
            })
            index = ids.indexOf(id);
            if(index !== -1){
                data.allitems[type].splice(index , 1);
            }
        } ,
        CalculatePercentage(){
            data.allitems.exp.forEach(function(element){
                element.CalcPercentage(data.totals.inc);
            })
        },

        GetPercentage(){
            var allPercentage = data.allitems.exp.map(function(element){
                return element.GetPercentage();
            })
            return allPercentage;
        },
        
        CalculateBudget : () => {
            CalculateTotal('inc');
            CalculateTotal('exp');
            data.budget = data.totals.inc - data.totals.exp;
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
        } , 

        GetBudget : () => {
            return {
                budget : data.budget ,
                totalIncome : data.totals.inc , 
                totalExpenses : data.totals.exp , 
                percentage : data.percentage
            };
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
        expensesContainer : '.expenses__list' ,
        budgetLabel : '.budget__value' , 
        incomeLabel : '.budget__income--value' ,
        expensesLabel : '.budget__expenses--value' , 
        percentageLabel : '.budget__expenses--percentage' ,
        container : '.container' ,
        expensesPercentage : '.item__percentage'
    };
    
    return {
        GetInput : () => {
            return {
                type : document.querySelector(DOMstrings.inputType).value, // inc or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        } ,

        AddListItem : (obj , type) => {
            var html , element;
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-' + 
                obj.id + '"><div class="item__description">' + 
                obj.description + '</div><div class="right clearfix"><div class="item__value">' + obj.value + 
                '</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-' + obj.id + 
                '"><div class="item__description">' + obj.description + 
                '</div><div class="right clearfix"><div class="item__value">' + obj.value + 
                '</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            document.querySelector(element).insertAdjacentHTML('beforeend' , html);
        },

        DeleteListItem : (selectorID) => {
            var el;
            el = document.getElementById(selectorID); 
            el.parentNode.removeChild(el);
        } ,

        GetDOMstrings : () => {
            return DOMstrings;
        } , 

        ClearFields : () => {
            var fields , fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(element => {
                element.value = "";
            });
            fieldsArray[0].focus();
        } ,

        DisplayPercentage : (percentages) => {
            var fields = document.querySelectorAll(DOMstrings.expensesPercentage);
            var nodeListForEach = function (list , callback){
                for(var i = 0; i<list.length;i++){
                    callback(list[i] , i); 
                }    
            }
            nodeListForEach(fields , function(element , index){
                if(percentages[index] > 0){
                    element.textContent = percentages[index] + '%';
                }
                else {
                    element.textContent = '---';
                }
            });
        },

        DisplayBudget : (obj) => {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExpenses;
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
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
        document.querySelector(DOM.container).addEventListener('click' , CtrlDeleteItem);
    }
    
    function UpdateBudget() {
        budgetCtrl.CalculateBudget();
        var budget = budgetCtrl.GetBudget();
        UICtrl.DisplayBudget(budget);
    }

    function HandleAddBtnClickEvent(){
        var input , newItem;
        input = UICtrl.GetInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            newItem = budgetCtrl.AddItem(input.type , input.description , input.value);
            UICtrl.AddListItem(newItem , input.type);
            UICtrl.ClearFields();
            UpdateBudget();
            updatePercentages();
        }
    }

    function CtrlDeleteItem(event){
        var itemID , splitedID , type , ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitedID = itemID.split('-');
            type = splitedID[0];
            ID = parseInt(splitedID[1]);
            budgetCtrl.DeleteItem(type , ID);
            UICtrl.DeleteListItem(itemID);
            UpdateBudget();
            updatePercentages();
        }
    }

    function updatePercentages(){
        budgetCtrl.CalculatePercentage();
        var percentage = budgetCtrl.GetPercentage();
        UICtrl.DisplayPercentage(percentage);
    }


    return {
        init : () => {
            UICtrl.DisplayBudget({
                budget : 0 ,
                totalIncome : 0 , 
                totalExpenses : 0 , 
                percentage : -1
            })
            SetupEventListeners();
        }
    }


})(budgetController , UIController);

AppController.init();