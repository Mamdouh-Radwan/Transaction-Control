let displayE = document.querySelector('#data');
let userSearch = document.querySelector('#userSearch');
let AmountFilter = document.querySelector('#filterAmount');
let customersToDisplay = [];
let transactionsToDisplay = [];

(async () =>{
  customersPreSort =  await getResponse('https://my-json-server.typicode.com/mamdouh-radwan/Transaction-Control/customers');
  transactionsPreSort = await getResponse('https://my-json-server.typicode.com/Mamdouh-Radwan/Transaction-Control/transactions');
})();


fetchAndDisplay();

async function fetchAndDisplay(){
  let customers= await getResponse('https://my-json-server.typicode.com/Mamdouh-Radwan/Transaction-Control/customers');
  let transactions= await getResponse('https://my-json-server.typicode.com/Mamdouh-Radwan/Transaction-Control/transactions');

  customersToDisplay = customers;
  transactionsToDisplay = transactions;

  displayDataCLorder(customersToDisplay,transactionsToDisplay);
};

async function getResponse(url, key = "") {
    let response = await fetch(`${url}${key}`);
    response = await response.json();
    
    return response;
};

async function displayDataCLorder(customers,transactions) {
    let cartona='';
    for(i=0; i < customers.length; i++){
      for(j=0; j< transactions.length; j++){
        if((transactions[j].customer_id) == (customers[i].id)){
          cartona +=`<tr>
                      <td>${customers[i].name}</td>
                      <td>${customers[i].id}</td>
                      <td>${transactions[j].amount}</td>
                      <td>${transactions[j].date}</td>
                   </tr>`;     
        }
      }
    }
    displayE.innerHTML = cartona;
};
async function displayDataTRorder(customers,transactions) {
  let cartona='';
  for(i=0; i < transactions.length; i++){
    for(j=0; j< customers.length; j++){
      if((transactions[i].customer_id) == (customers[j].id)){
        cartona +=`<tr>
                    <td>${customers[j].name}</td>
                    <td>${customers[j].id}</td>
                    <td>${transactions[i].amount}</td>
                    <td>${transactions[i].date}</td>
                 </tr>`;     
      }
    }
  }
  displayE.innerHTML = cartona;
};

async function sortData(by, order){
  switch (by) {
    case 'Date':
      (order == 'ascending') ? transactionsToDisplay.sort((a,b) => new Date(a.date) - new Date(b.date)) : transactionsToDisplay.sort((a,b) => new Date(b.date) - new Date(a.date));
      displayDataTRorder(customersToDisplay,transactionsToDisplay)
      break;
    case 'Transaction amount':
      (order == 'ascending') ? transactionsToDisplay.sort((a,b) => a.amount - b.amount) : transactionsToDisplay.sort((a,b) => b.amount - a.amount);
      displayDataTRorder(customersToDisplay,transactionsToDisplay)
      break;
    case 'Customer name':
      (order == 'ascending') ? customersToDisplay.sort((a,b) => a.name.localeCompare(b.name)) : customersToDisplay.sort((a,b) => b.name.localeCompare(a.name));
      displayDataCLorder(customersToDisplay,transactionsToDisplay)
      break;
    case 'None':
      displayDataCLorder(customersPreSort,transactionsPreSort)
      break;
  }
}

document.querySelector('#sortBy').addEventListener('change', (e) =>{
  sortData(e.target.value , document.querySelector('#sortOrder').value);
})

document.querySelector('#sortOrder').addEventListener('change', (e) =>{
  sortData(document.querySelector('#sortBy').value , e.target.value);
})

userSearch.addEventListener('input', (e) =>{

  customersToDisplay = customersPreSort;
  let searchTerm = e.target.value;
  let foundedCustomers=[];

  if(e.target.value === ''){
    transactionsToDisplay = transactionsPreSort;
    sortData(document.querySelector('#sortBy').value , document.querySelector('#sortOrder').value);
  }
  else{
    for(i = 0; i < customersToDisplay.length; i++){
      if(customersToDisplay[i].name.toLowerCase().includes(searchTerm.toLowerCase())){
        foundedCustomers.push(customersToDisplay[i]);
      }
    }
    if(foundedCustomers.length === 0){
      displayE.innerHTML = `<tr><td colspan="4" class="fs-5">No customer Found !</td></tr>`
    }
    else{
      customersToDisplay = foundedCustomers;
      displayDataCLorder(customersToDisplay, transactionsToDisplay)
    }
  }
})

AmountFilter.addEventListener('click',(e) =>{
  transactionsToDisplay = transactionsPreSort;
  let foundedTransactions=[];

  if(document.querySelector('#minAmount').value ==='' || document.querySelector('#maxAmount').value ===''){
    sortData(document.querySelector('#sortBy').value , document.querySelector('#sortOrder').value);
  }
  else{
    for(i =0; i < transactionsToDisplay.length; i++){
      if(transactionsToDisplay[i].amount >= (document.querySelector('#minAmount').value) && transactionsToDisplay[i].amount <= (document.querySelector('#maxAmount').value)){
        foundedTransactions.push(transactionsToDisplay[i]);
        console.log(true);
      }
    }

    if(foundedTransactions.length === 0){
      displayE.innerHTML = `<tr><td colspan="4" class="fs-5">No transactions Found !</td></tr>`
    }
    else{
      transactionsToDisplay = foundedTransactions;
      displayDataTRorder(customersToDisplay,transactionsToDisplay)
    }
  }
})


