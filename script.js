'use strict';

// DATA
const account1 = {
  owner: 'Oto Machala',
  movements: [100, 200, 300, -500, -123, 10, 650, -2300, 20],
  interestRate: 1.2,
  pin: 1111,
};
const account2 = {
  owner: 'Peter Sveter',
  movements: [1100, 5000, -300, -500, -123, 820, -2345],
  interestRate: 1.5,
  pin: 2222,
};
const account3 = {
  owner: 'Maria Kolacova',
  movements: [14, 1200, -200, 530, 210, -55, -34, -150, 1100],
  interestRate: 1.2,
  pin: 3333,
};

const account4 = {
  owner: 'Jozef Mak',
  movements: [100, -123, 1030, 210, -55],
  interestRate: 1.2,
  pin: 3333,
};

const accounts = [account1, account2, account3, account4];

// Elements
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInt = document.querySelector('.summary__value--interest');
const labelWelcome = document.querySelector('.welcome');

const btnLogin = document.querySelector('.login__btn');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');

//Logic
const displayMovements = function (movements) {
  containerMovements.innerHTML = ''; // hide actual value from index.html
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}
        </div>
        <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Show current balance
const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((accumulator, mov) => accumulator + mov, 0);
  labelBalance.textContent = `${balance}€`;
};

// Incomes and Outcomes and Interest money
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * (account.interestRate / 100)) // Edit later
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInt.textContent = `${interest}€`;
};

// Username short name
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// Event Handler - Login
let currentAccount;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault(); // stop reload webpage
  console.log('login');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //dispaly welocome msg
    console.log('login pin');
    labelWelcome.textContent = `welcome back ${
      currentAccount.owner.split('  ')[0]
    }`;
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';

    // display movements
    displayMovements(currentAccount.movements);
    // display balance
    calcDisplayBalance(currentAccount.movements);
    // display summary
    calcDisplaySummary(currentAccount);
  }
});
