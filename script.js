form = document.getElementById('my-form');
itemList = document.getElementById('items');
const msg=document.querySelector('.msg');

form.addEventListener('submit',addItem);

function addItem(e){

    e.preventDefault();
    var newItem = document.getElementById('ItemName');
    var newDescription = document.getElementById('Description');
    var newPrice = document.getElementById('Price');
    var newQuantity = document.getElementById('Quantity');

    if(newItem.value===''||newDescription.value===''||newPrice.value===''|| newQuantity.value===''){
        msg.classList.add('error');
        msg.innerHTML='Please enter all fields';
        // remove error after 3 sec
        setTimeout(()=>msg.remove(),3000);
    }else{
        var storedData = localStorage.getItem(newItem.value);

        var newEntity={
            ItemName:newItem.value,
            Description:newDescription.value,
            Price:newPrice.value,
            Quantity:newQuantity.value
        }
        
        axios.post("https://crudcrud.com/api/b70632cdb55540a787d6c265ed5145e3/addItems",newEntity)
            .then(response => {
                console.log(response);
                showNewUserOnScreen(response.data)
            })
            .catch(err => {
                console.log(err);
            })
        //clear fields
        newItem.value='';
        newDescription.value='';
        newPrice.value='';
        newQuantity.value='';
    }
}

function showNewUserOnScreen(obj){
    var li =document.createElement('li');
    li.dataset.id = obj._id;
    li.className = "list-group-item";

    li.appendChild(document.createTextNode("Item: "+obj.ItemName+"  "));
    li.appendChild(document.createTextNode("Description:"+obj.Description+"    "));
    li.appendChild(document.createTextNode("Price: "+obj.Price+"     "));
    li.appendChild(document.createTextNode("Quantity:"+obj.Quantity));
        
    var buy1 = document.createElement('button');
    buy1.classList = "btn btn-primary btn-sm float-right edit";
    buy1.appendChild(document.createTextNode('Buy:1'));

    var buy2 = document.createElement('button');
    buy2.classList = "btn btn-primary btn-sm float-right edit";
    buy2.appendChild(document.createTextNode('Buy:2'));

    var buy3 = document.createElement('button');
    buy3.classList = "btn btn-primary btn-sm float-right edit";
    buy3.appendChild(document.createTextNode('Buy:3'));

    buy1.setAttribute('onclick',`Buy1Item('${obj.ItemName}','${obj.Description}','${obj.Price}','${obj.Quantity}''${obj._id}')`);
    buy2.setAttribute('onclick',`Buy2Item('${obj.ItemName}','${obj.Description}','${obj.Price}','${obj.Quantity}''${obj._id}')`); 
    buy3.setAttribute('onclick',`Buy3Item('${obj.ItemName}','${obj.Description}','${obj.Price}','${obj.Quantity}''${obj._id}')`); 

    li.appendChild(buy1);
    li.appendChild(buy2);
    li.appendChild(buy3);
    itemList.appendChild(li);
}
window.addEventListener("DOMContentLoaded",() => {
    axios.get("https://crudcrud.com/api/b70632cdb55540a787d6c265ed5145e3/addItems")
    .then(res=>{
        const data = res.data;
        data.forEach(item =>{
            showNewUserOnScreen(item);
        });
        
    })
    .catch(err=>{
        console.log(err);
    })
})
