import axios, { AxiosResponse } from "axios";
import supabase from "./services/supabase";
import { supabaseApiKey } from "./services/supabaseApiKey";

class Carteira {
  id_usuario: number;

  constructor(id_usuario: number) {
    this.id_usuario = id_usuario;
  }

  static async buscarCarteira(id_usuario: number) {
    try {
      const response = await axios.get(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Carteira?id_usuario=eq.${id_usuario}`,
        {
          headers: {
            apikey: supabaseApiKey, // Substitua pela sua chave de API
          },
        }
      );

      // Verifique se a solicitação foi bem-sucedida
      if (response.status === 200) {
        // Os dados da tabela "Carteira" estão em response.data
        return response.data;
      } else {
        throw new Error("Erro ao buscar dados da Carteira.");
      }
    } catch (error) {
      throw error;
    }
  }

  async cadastrarCarteira(id_usuario: number) {
    try {
      const response = await supabase.post(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Carteira`, // Substitua "seu-tabela" pelo nome da tabela que você deseja inserir os dados
        {
          id_usuario: id_usuario,
        },
        {
          headers: {
            apikey: supabaseApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Carteira(dependente) criada com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao inserir dados do remédio:", error);
      throw error;
    }
  }
}

export default Carteira;
