import Vacina from "./Vacina";
import axios, { AxiosResponse } from "axios";
import supabase from "./services/supabase";
import { supabaseApiKey } from "./services/supabaseApiKey";

class VacinaDependete extends Vacina {
  constructor(
    id_carteira: number,
    Nome_Vacina: string,
    Local_Vacinacao: string,
    Data_Vacinacao: string,
    Dose: number
  ) {
    super(id_carteira, Nome_Vacina, Local_Vacinacao, Data_Vacinacao, Dose);
  }

  static async buscarVacinaDependente(id_carteiraDependente: number) {
    try {
      const response = await axios.get(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Vacina_Dependente?id_carteiraDependente=eq.${id_carteiraDependente}`,
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

  async cadastrarVacinaDependente(
    id_carteiraDependente: number,
    Nome_Vacina: string,
    Local_Vacinacao: string,
    Data_Vacinacao: string,
    Dose: number
  ) {
    try {
      const response = await supabase.post(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Vacina_Dependente`, // Substitua "seu-tabela" pelo nome da tabela que você deseja inserir os dados
        {
          id_carteiraDependente: id_carteiraDependente,
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

      console.log("Vacina de dependente criada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao inserir dados:", error);
      throw error;
    }
  }

  static async editarVacinaDependente(
    id_carteiraDependente: number,
    id_vacinaDependente: number,
    Nome_Vacina: string,
    Local_Vacinacao: string,
    Data_Vacinacao: string,
    Dose: number
  ) {
    try {
      const response = await supabase.patch(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Vacina_Dependente?id_vacinaDependente=eq.${id_vacinaDependente}&id_carteiraDependente=eq.${id_carteiraDependente}`,
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

  static async excluirVacinaDependente(
    id_carteiraDependente: number,
    id_vacinaDependente: number
  ) {
    try {
      const response = await supabase.delete(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Vacina_Dependente?id_vacinaDependente=eq.${id_vacinaDependente}&id_carteiraDependente=eq.${id_carteiraDependente}`,
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

export default VacinaDependete;
