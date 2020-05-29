import React, { Component } from 'react';

import './Calculator.css';
import Button from '../components/Button';
import Display from '../components/Display';

const initialState = {
  displayValue: '0',
  clearDisplay: false,
  operation: null,
  values: [0, 0],
  current: 0
}

export default class Calculator extends Component {

  state = { ...initialState };

  constructor(props) {
    super(props);
    this.clearMemory = this.clearMemory.bind(this);
    this.setOperation = this.setOperation.bind(this);
    this.addDigit = this.addDigit.bind(this);
  }

  clearMemory() {
    this.setState({ ...initialState });
  }

  setOperation(operation) {
    // esse if ocorre depois do usuário digitar o 1º número e clicar em um botão de operação
    // é necessário limpar o display e armazenar o 2º número que será digitado no próximo índice do array (1)
    // se o valor corrente é o 0 (ou seja, o usuário só digitou o 1º número e em seguida clicou em uma operação)
    if (this.state.current === 0) {

      // altera o state, passando a nova operação, colocando o valor corrente como 1 (2º número) e limpa o display
      this.setState({ operation, current: 1, clearDisplay: true });

    // esse else ocorre depois do usuário digitar o 2º número e clicar em um botão de operação
    // é necessário limpar o display e realizar a operação entre os dois números digitados
    // se o valor corrente não é o 0 (ou seja, é 1; o usuário digitou o 2º número e em seguida clicou em uma operação)
    } else {
      // indica se o usuário clicou no botão de =
      // ou seja, ele quer saber o resultado
      const equals = operation === '=';

      // pega a última operação na qual o usuário clicou
      const currentOperation = this.state.operation;

      const values = [...this.state.values];

      switch(currentOperation) {
        case '+':
          values[0] = values[0] + values[1];
          break;
        case '-':
          values[0] = values[0] - values[1];
          break;
        case '*':
          values[0] = values[0] * values[1];
          break;
        case '/':
          values[0] = values[0] / values[1];
          break;
        default:
          break;
      }

      // substitui operação feita com switch; eval é desaconselhado
      /*
      try {
        values[0] = eval(`${values[0]} ${currentOperation} ${values[1]}`);
      } catch(e) {
        values[0] = this.state.values[0];
      }
      */
      
      values[1] = 0;

      // modificando o valor do state
      this.setState({
        // coloca o primeiro número no display (resultado)
        displayValue: values[0],
        // se a operação clicada for =, o operation fica nulo
        operation: equals ? null : operation,
        // se a operação clicada for =, o valor atual é o 0; senão é o 1
        current: equals ? 0 : 1,
        // só limpa o display se o usuário clicou no =
        clearDisplay: !equals,
        values
      })
    }
  }

  addDigit(n) {
    // se o dígito digitado é . e já existe um . no número, não fazer nada e retornar; evita que seja digitado 8.32.31 por exemplo
    if (n === '.' && this.state.displayValue.includes('.')) {
      return;
    }

    // limpa o display quando ele só contém 0, assim não fica com 0 a esquerda, como 001, por exemplo
    const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay;

    // pega o valor corrente: se o display for limpo, colocar como vazio; senão, pegar o valor atual do display
    const currentValue = clearDisplay ? '' : this.state.displayValue;

    // valor do display vai ser o atual mais o que foi digitado
    const displayValue = currentValue + n;

    // manda para o state o novo valor do displayValue e o clearDisplay como false
    this.setState({ displayValue, clearDisplay: false });

    // se o dígito digitado não for . vai ir adicionando o valor que está sendo digitado para o array values[0,1] que está no state
    if (n !== '.') {
      // pega o índice atual do array (se é o 1º ou 2º número que o usuário está digitando)
      const i = this.state.current;
      // converte o valor do display para float
      const newValue = parseFloat(displayValue);
      // coloca o values do state em uma nova variável
      const values = [...this.state.values];
      // coloca o valor do display como o 1º ou 2º número do array de values
      values[i] = newValue;
      // passa o novo array de values, contendo o 1º ou 2º número, para o state
      this.setState({ values });
    }
  }

  render() {
    return (
      <div className="calculator">
        <Display value={this.state.displayValue} />
        <Button label="AC" click={this.clearMemory} triple />
        <Button label="/" click={this.setOperation} operation />
        <Button label="7" click={this.addDigit} />
        <Button label="8" click={this.addDigit} />
        <Button label="9" click={this.addDigit} />
        <Button label="*" click={this.setOperation} operation />
        <Button label="4" click={this.addDigit} />
        <Button label="5" click={this.addDigit} />
        <Button label="6" click={this.addDigit} />
        <Button label="-" click={this.setOperation} operation />
        <Button label="1" click={this.addDigit} />
        <Button label="2" click={this.addDigit} />
        <Button label="3" click={this.addDigit} />
        <Button label="+" click={this.setOperation} operation />
        <Button label="0" click={this.addDigit} double />
        <Button label="." click={this.addDigit} />
        <Button label="=" click={this.setOperation} operation />
      </div>
    )
  }
}