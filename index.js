
var store = {
    save(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    },
    fetch(key){
        return JSON.parse(localStorage.getItem(key)) || [];
    }
};

var dataList = store.fetch("To-Do-List");

var doFilter = {
    all(list){
        return list;
    },
    todo(list){
        return list.filter(function (item) {
            return !item.isChecked;
        })
    },
    done(list){
        return list.filter(function (item) {
            return item.isChecked;
        })
    }
}


var vm = new Vue({
    el: ".main",
    data:{
        list: dataList,
        addTitle: "",
        lastEdit: "",
        editTodo: "",
        visibility: "all"
    },
    watch: {
        list: {
            handler(){
                store.save("To-Do-List",this.list);
            },
            deep:true
        }
    },
    methods:{
        addItem(){
            if (this.addTitle) {
                this.list.push({
                    title: this.addTitle,
                    date: Date(),
                    isChecked: false,
                });
                this.addTitle = ""
            }
        },
        clickHandle(todo){
            this.lastEdit = todo.title;
            this.editTodo = todo
        },
        editDone(){
            this.editTodo = "";
            this.lastEdit = ""
        },
        editCancel(todo){
            todo.title = this.lastEdit;
            this.editTodo = "";
            this.lastEdit = ""
        },
        deleteList(todo){
            var num = this.list.indexOf(todo);
            this.list.splice(num,1);
        }
    },
    computed:{
        todolist_length() {
            return this.list.filter(function (item) {
                return !item.isChecked;
            }).length;
        },
        filterList(){
            return doFilter[this.visibility] ? doFilter[this.visibility](this.list) : this.list;
        }
    },
    directives: {
        "focus": {
            update(el,bingding){
                if(bingding.value){
                    el.focus();
                }
            }
        }
    }
});



function watchHashChange(){
    var hash = window.location.hash.slice(1);
    vm.visibility = hash;
}

window.addEventListener("hashchange",watchHashChange)