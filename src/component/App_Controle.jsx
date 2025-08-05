import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

import './App_Controle.css'

const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#F8E71C', '#BD10E0', '#9013FE']; // Paleta de cores mais moderna

const App_Controle = () => {
  // ... (Sua lógica de estado e funções aqui) ...
  const [controle, setControle] = useState(() => {
    const dadosSalvos = localStorage.getItem('Gastos');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });
  const [salario, setSalario] = useState(() => {
    const sal = localStorage.getItem("Salario");
    return sal ? sal : '';
  });
  const [salarioEditavel, setSalarioEditavel] = useState(true);
  const [gasto, setGasto] = useState({
    descricao: '',
    valor: '',
    categoria: '',
    data: ''
  });
  useEffect(() => {
    localStorage.setItem('Gastos', JSON.stringify(controle));
  }, [controle]);
  useEffect(() => {
    localStorage.setItem('Salario', salario);
  }, [salario]);
  const enviar = (e) => {
    e.preventDefault();
    if (
      gasto.descricao.trim() === '' ||
      gasto.valor === '' ||
      gasto.categoria.trim() === '' ||
      gasto.data === '' ||
      salario.trim() === ''
    ) return;
    setControle([...controle, gasto]);
    setGasto({
      descricao: '',
      valor: '',
      categoria: '',
      data: ''
    });
  };
  const totalGasto = controle.reduce((acc, item) => acc + parseFloat(item.valor), 0);
  const saldoRestante = parseFloat(salario || 0) - totalGasto;
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  const gastoPorCategoria = controle.reduce((acc, gasto) => {
    if (!acc[gasto.categoria]) {
      acc[gasto.categoria] = 0;
    }
    acc[gasto.categoria] += parseFloat(gasto.valor);
    return acc;
  }, {});
  const dataGrafico = Object.entries(gastoPorCategoria).map(([categoria, valor]) => ({
    name: categoria,
    value: valor
  }));

{/*remover valores*/}
  const removeValore = (index) =>{
    const novoControle = controle.filter((_, i)=> i !== index);
    setControle(novoControle)
  }
  return (
    <div className="app-container">
      <header className="header">
        <h1>💰 Controle de Gastos Pessoais</h1>
      </header>

      <div className="main-content">
        {/* Bloco do Salário */}
        <div className="section-card salario-card">
          <div className="salario-input-group">
            <input
              type="number"
              placeholder="Salário Mensal"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
              disabled={!salarioEditavel}
              className="input-field"
            />
            {salarioEditavel ? (
              <button onClick={() => setSalarioEditavel(false)} className="btn btn-save">Salvar</button>
            ) : (
              <button onClick={() => setSalarioEditavel(true)} className="btn btn-edit">Editar</button>
            )}
          </div>
          <div className="salario-info">
            <p className="info-item"><strong>Salário do Mês:</strong> <span>{formatarMoeda(salario)}</span></p>
            <p className={`info-item ${saldoRestante < 0 ? "negativo" : "positivo"}`}>
              <strong>Saldo Restante:</strong> <span>{formatarMoeda(saldoRestante)}</span>
            </p>
          </div>
        </div>

        {/* Bloco do Formulário de Gasto */}
        <div className="section-card form-card">
          <h3>Adicionar Novo Gasto</h3>
          <form onSubmit={enviar} className="form-gastos">
            <input
              type="text"
              placeholder="Descrição"
              value={gasto.descricao}
              onChange={(e) => setGasto({ ...gasto, descricao: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Valor"
              value={gasto.valor}
              onChange={(e) => setGasto({ ...gasto, valor: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Categoria"
              value={gasto.categoria}
              onChange={(e) => setGasto({ ...gasto, categoria: e.target.value })}
              className="input-field"
            />
            <input
              type="date"
              value={gasto.data}
              onChange={(e) => setGasto({ ...gasto, data: e.target.value })}
              className="input-field"
            />
            <button type="submit" className="btn btn-add">Adicionar Gasto</button>
          </form>
        </div>

        {/* Bloco de Resumo e Gráfico */}
        <div className="section-card resumo-card">
          <h3>📊 Resumo de Gastos</h3>
          <div className="resumo-content">
            <div className="lista-gastos-container">
              <h4>Gastos Lançados</h4>
              <ul className="lista-gastos">
                {controle.map((g, index) => (
                  <li key={index} className="gasto-item">
                    <span>{g.descricao}</span>
                    <span>{formatarMoeda(g.valor)}</span>
                    <span>{g.categoria}</span>
                    <span>{g.data}</span>
                    <button onClick={() => removeValore(index)} className="btn delete-button">Excluir</button>
                  </li>
                ))}
              </ul>
              <div className="total-gasto">
                <strong>Total Gasto:</strong> <span>{formatarMoeda(totalGasto)}</span>
              </div>
            </div>

            <div className="grafico-container">
              <h4 className="chart-title">Gastos por Categoria</h4>
              <div className="chart-wrapper">
                

                <BarChart width={400} height={300} data={dataGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatarMoeda(value)} />
                    <Legend />
                    <Bar dataKey="value" fill="#4A90E2" />
                </BarChart>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App_Controle;