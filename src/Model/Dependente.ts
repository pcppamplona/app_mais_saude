import Usuario from "./Usuário";
import axios, { AxiosResponse } from "axios";
import supabase from "./services/supabase";
import { supabaseApiKey } from "./services/supabaseApiKey";

class Dependente extends Usuario {
  id_usuario: number;

  constructor(
    id_usuario: number,
    Nome_Completo: string,
    Data_Nascimento: string,
    Sexo: string
  ) {
    super("", "", Nome_Completo, "", Data_Nascimento, Sexo);
    this.id_usuario = id_usuario;
  }

  static async buscarDependentes(id_usuario: number) {
    try {
      const response = await axios.get(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Dependente?id_usuario=eq.${id_usuario}`,
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

  async cadastrarDependente(
    id_usuario: number,
    Nome_Completo: string,
    Data_Nascimento: string,
    Sexo: string
  ) {
    try {
      const response = await supabase.post(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Dependente`, // Substitua "seu-tabela" pelo nome da tabela que você deseja inserir os dados
        {
          id_usuario: id_usuario,
          Nome_Dependente: Nome_Completo,
          Data_Nascimento: new Date(Data_Nascimento),
          Sexo: Sexo,
        },
        {
          headers: {
            apikey: supabaseApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Dados inseridos com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao inserir dados:", error);
      throw error;
    }
  }

  static async buscarDependenteId(id_dependente: number) {
    try {
      const response = await axios.get(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Dependente?id_dependente=eq.${id_dependente}`,
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

  static async editarDependente(
    id_usuario: number,
    id_dependente: number,
    Nome_Completo: string,
    Data_Nascimento: string,
    Sexo: string
  ) {
    try {
      const response = await supabase.patch(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Dependente?id_dependente=eq.${id_dependente}&id_usuario=eq.${id_usuario}`,
        {
          Nome_Dependente: Nome_Completo,
          Data_Nascimento: new Date(Data_Nascimento),
          Sexo: Sexo,
        },
        {
          headers: {
            apikey: supabaseApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Remédio atualizado com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao atualizar remédio:", error);
      throw error;
    }
  }

  static async excluirDependente(id_usuario: number, id_dependente: number) {
    try {
      const response = await supabase.delete(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Dependente?id_dependente=eq.${id_dependente}&id_usuario=eq.${id_usuario}`,
        {
          headers: {
            apikey: supabaseApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Remédio excluído com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao excluir remédio:", error);
      throw error;
    }
  }
}

export default Dependente;
