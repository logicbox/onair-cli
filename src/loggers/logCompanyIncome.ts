import chalk from "chalk";
import { IncomeStatement, Account } from "onair-api";

const log = console.log;

const logAccounts = (account: Account[], cols: number): void => {
  account.forEach((ISAccount) => {
    const amount = ISAccount.Amount.toLocaleString('en-GB');
    const paddingCount = cols - ISAccount.Name.length - amount.length;
    log(ISAccount.Name + chalk.gray('.'.repeat(paddingCount)) + amount);
  });
}

export const logCompanyIncome = (income: IncomeStatement, daysToDisplay: number, cols:number = 80): void => {
  

  const lengthLabel = daysToDisplay > 1 ? daysToDisplay + ' days' : 'day';

  log(chalk.greenBright.bold(`Your income statement summary for the last ${lengthLabel}\n`));

  const revLabel = 'Revenues';
  const revAmountLabel = income.REVAmount.toLocaleString('en-GB') + ' 💰';
  const revPaddingCount = cols - revLabel.length - revAmountLabel.length;

  log(chalk.cyanBright(revLabel) + ' '.repeat(revPaddingCount) + revAmountLabel + '\n');

  const headersPaddingCount = cols - 'Name'.length - 'Amount'.length;

  log(chalk.green('Name') + ' '.repeat(headersPaddingCount) + chalk.green('Amount'));

  logAccounts(income.REVAccounts, cols);

  const expLabel = 'Expenses';
  const expAmountLabel = income.EXPAmount.toLocaleString('en-GB') + ' 💰';
  const expPaddingCount = cols - expLabel.length - expAmountLabel.length;

  log('\n' + chalk.cyanBright(expLabel) + ' '.repeat(expPaddingCount) + expAmountLabel + '\n');

  log(chalk.green('Name') + ' '.repeat(headersPaddingCount) + chalk.green('Amount'));

  logAccounts(income.EXPAccounts, cols);

  const netIncomeLabel = 'Net income for the period';
  const netIncomeAmountLabel = income.NetIncomeAmount.toLocaleString('en-GB') + ' 💰';
  const netIncomePaddingCount = cols - netIncomeLabel.length - netIncomeAmountLabel.length;

  log('\n' + chalk.cyanBright(netIncomeLabel) + ' '.repeat(netIncomePaddingCount) + netIncomeAmountLabel);
}