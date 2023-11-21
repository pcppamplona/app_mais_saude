import axios, { AxiosResponse } from "axios";
import supabase from "./services/supabase";
import { supabaseApiKey } from "./services/supabaseApiKey";

class ProximaVacina {
  id_dependente: number;
  Nome_Vacina: string;
  Dose: string;

  constructor(id_dependente: number, Nome_Vacina: string, Dose: string) {
    this.id_dependente = id_dependente;
    this.Nome_Vacina = Nome_Vacina;
    this.Dose = Dose;
  }

  static async verificacaoProxVacina(
    id_dependente: number,
    Nome_Vacina: string,
    Dose: string
  ) {
    try {
      // Passo 1: Verifica se há registros na tabela Proxima_Vacina com o ID do dependente
      const { data: registrosProximaVacina } = await axios.get(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Proxima_Vacina?id_dependente=eq.${id_dependente}`, 
        {
          headers: {
            apikey: supabaseApiKey,
          },
        }
      );

      console.log("Deu um get")

      if (registrosProximaVacina.length > 0) {
        // Passo 2: Verifica se há correspondência com os valores passados por parâmetro
        const registroProximaVacina = registrosProximaVacina[0];
        if (
          registroProximaVacina.Nome_Vacina === Nome_Vacina &&
          registroProximaVacina.Dose === Dose
        ) {
          console.log("Tudo ok");
          return false;
        } else {
          // Passo 3: Atualiza os valores na tabela Proxima_Vacina
          console.log("vai dar um pacth")
          await supabase.patch(
            `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Proxima_Vacina?id_proximaVacina=eq.${registroProximaVacina.id_proximaVacina}`,
            { Nome_Vacina: Nome_Vacina, Dose: Dose },
            {
              headers: {
                apikey: supabaseApiKey,
                "Content-Type": "application/json",
              },
            }
          );
          return { Nome_Vacina: Nome_Vacina, Dose: Dose };
        }
      } else {
        // Passo 4: Insere um novo registro na tabela Proxima_Vacina
        console.log("vai dar um post")
        const { data: novoRegistro } = await supabase.post(
          "https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Proxima_Vacina",
          { id_dependente: id_dependente, Nome_Vacina: Nome_Vacina, Dose: Dose },
          {
            headers: {
              apikey: supabaseApiKey,
              "Content-Type": "application/json",
            },
          }
        );
        return novoRegistro;
      }
    } catch (error) {
      console.log("Deu erro:"+error);
      throw error;
    }
  }

  static async buscarProxVacinas(id_dependente: number){
    try{
      const response = await axios.get(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Proxima_Vacina?id_dependente=eq.${id_dependente}`,
        {
          headers: {
            apikey: supabaseApiKey,
          },
        }
      );

      const data = response.data;
      return data;
    }catch(error){
      throw error;
    }
  }
}

export default ProximaVacina;
