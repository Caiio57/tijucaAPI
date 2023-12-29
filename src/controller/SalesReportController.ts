import { Request, Response } from 'express';
import { SalesReport } from '../services/SalesReport';

const salesReport = new SalesReport();

export const displaySalesReport = async (req: Request, res: Response): Promise<void> => {
  try {
    await salesReport.displaySalesReport();
    res.status(200).json({ message: 'Relatório de vendas mostrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao mostrar o relatório de vendas:', error);
    res.status(500).json({ error: 'Falha ao mostrar o relatório de vendas.' });
  }
};
