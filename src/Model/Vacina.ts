import axios, { AxiosResponse } from "axios";
import supabase from "./services/supabase";
import { supabaseApiKey } from "./services/supabaseApiKey";

class Vacina {
  id_carteira: number;
  Nome_Vacina: string;
  Local_Vacinacao: string;
  Data_Vacinacao: string;
  Dose: number;

  constructor(
    id_carteira: number,
    Nome_Vacina: string,
    Local_Vacinacao: string,
    Data_Vacinacao: string,
    Dose: number
  ) {
    this.id_carteira = id_carteira;
    this.Nome_Vacina = Nome_Vacina;
    this;
    Local_Vacinacao = Local_Vacinacao;
    this.Data_Vacinacao = Data_Vacinacao;
    this.Dose = Dose;
  }

  static async buscarVacina(id_carteira: number) {
    try {
      const response = await axios.get(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Vacina?id_carteira=eq.${id_carteira}`,
        {
          headers: {
            apikey: supabaseApiKey,
          },
        }
      );

      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async cadastrarVacina(
    id_carteira: number,
    Nome_Vacina: string,
    Local_Vacinacao: string,
    Data_Vacinacao: string,
    Dose: number
  ) {
    try {
      const response = await supabase.post(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Vacina`, // Substitua "seu-tabela" pelo nome da tabela que você deseja inserir os dados
        {
          id_carteiraDependente: id_carteira,
          Nome_Vacina: Nome_Vacina,
          Local_Vacinacao: Local_Vacinacao,
          Data_Vacinacao: Data_Vacinacao,
          Dose: Dose,
        },
        {
          headers: {
            apikey: supabaseApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Vacina criada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao inserir dados:", error);
      throw error;
    }
  }

  static async editarVacina(
    id_carteira: number,
    id_vacina: number,
    Nome_Vacina: string,
    Local_Vacinacao: string,
    Data_Vacinacao: string,
    Dose: number
  ) {
    try {
      const response = await supabase.patch(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Vacina?id_vacina=eq.${id_vacina}&id_carteira=eq.${id_carteira}`,
        {
          Nome_Vacina: Nome_Vacina,
          Local_Vacinacao: Local_Vacinacao,
          Data_Vacinacao: Data_Vacinacao,
          Dose: Dose,
        },
        {
          headers: {
            apikey: supabaseApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Vacina_Dependente atualizada com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao atualizar Vacina_Dependente:", error);
      throw error;
    }
  }

  static async excluirVacina(id_carteira: number, id_vacina: number) {
    try {
      const response = await supabase.delete(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Vacina?id_vacina=eq.${id_vacina}&id_carteira=eq.${id_carteira}`,
        {
          headers: {
            apikey: supabaseApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Vacina_Dependente excluída com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao excluir Vacina_Dependente:", error);
      throw error;
    }
  }
}

export default Vacina;
