import axios, { AxiosResponse } from "axios";
import supabase from "./services/supabase";
import { supabaseApiKey } from "./services/supabaseApiKey";

class CarteiraDependente {
  id_dependente: number;

  constructor(id_dependente: number) {
    this.id_dependente = id_dependente;
  }

  static async buscarCarteirasDependentes(id_usuario) {
    try {
      // Passo 1: Obter os IDs dos dependentes diretos do usuário
      const responseDependentes = await axios.get(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Dependente?id_usuario=eq.${id_usuario}`,
        {
          headers: {
            apikey: supabaseApiKey,
          },
        }
      );

      if (responseDependentes.status !== 200) {
        throw new Error("Erro ao buscar dependentes do usuário.");
      }

      const dependentesDiretos = responseDependentes.data;

      // Verificar se há dependentes antes de continuar
      if (dependentesDiretos.length === 0) {
        console.log("O usuário não tem dependentes.");
        return [];
      }

      // Passo 2: Extrair os IDs dos dependentes diretos
      const dependentesDiretosIds = dependentesDiretos.map(
        (dependente) => dependente.id_dependente
      );

      // Passo 3: Obter as carteiras dos dependentes dos dependentes
      const responseCarteiras = await axios.get(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Carteira_Dependente?id_dependente=in.(${dependentesDiretosIds.join()})`,
        {
          headers: {
            apikey: supabaseApiKey,
          },
        }
      );

      if (responseCarteiras.status !== 200) {
        throw new Error(
          "Erro ao buscar carteiras dos dependentes dos dependentes."
        );
      }

      console.log(responseCarteiras.data);
      return responseCarteiras.data;
    } catch (error) {
      throw error;
    }
  }

  async cadastrarCarteiraDependentes(id_dependente: number) {
    try {
      const response = await supabase.post(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Carteira_Dependente`, // Substitua "seu-tabela" pelo nome da tabela que você deseja inserir os dados
        {
          id_dependente: id_dependente,
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
      console.error("Erro ao criar carteira:", error);
      throw error;
    }
  }
}

export default CarteiraDependente;
