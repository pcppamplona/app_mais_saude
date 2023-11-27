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
    console.log("No model:"+id_usuario+Nome_Completo+Data_Nascimento+Sexo)
    try {
      const response = await supabase.post(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Dependente`, // Substitua "seu-tabela" pelo nome da tabela que você deseja inserir os dados
        {
          id_usuario: id_usuario,
          Nome_Dependente: Nome_Completo,
          Data_Nascimento: Data_Nascimento,
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
       // Verificar e obter o ID da carteira associada
      const id_carteira = await Dependente.verificarCarteiraDependente(id_dependente);

      // Verificar e excluir a próxima vacina
      await Dependente.verificarProximaVacina(id_dependente);

      // Excluir a carteira dependente (se existir)
      await Dependente.excluirCarteiraDependente(id_carteira);

      const response = await supabase.delete(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Dependente?id_dependente=eq.${id_dependente}&id_usuario=eq.${id_usuario}`,
        {
          headers: {
            apikey: supabaseApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Dependente excluído com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao excluir remédio:", error);
      throw error;
    }
  }

  static async verificarCarteiraDependente(id_dependente: number): Promise<number | null> {
    try {
      const response = await supabase.get(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Carteira_Dependente?id_dependente=eq.${id_dependente}`,
        {
          headers: {
            apikey: supabaseApiKey,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.length > 0) {
        // Retorna o ID da carteira associada ao dependente
        return response.data[0].id_carteiraDependente;
      } else {
        // Não há carteira associada ao dependente
        console.log("Não tem carteira")
        return null;
      }
    } catch (error) {
      console.error("Erro ao verificar carteira dependente:", error);
      throw error;
    }
  }

  static async excluirCarteiraDependente(id_carteira: number): Promise<void> {
    try {
      if (id_carteira) {
        const response = await supabase.delete(
          `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Carteira_Dependente?id_carteiraDependente=eq.${id_carteira}`,
          {
            headers: {
              apikey: supabaseApiKey,
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log("Carteira dependente excluída com sucesso:", response.data);
      }
    } catch (error) {
      console.error("Erro ao excluir carteira dependente:", error);
      throw error;
    }
  }

  static async verificarProximaVacina(id_dependente: number): Promise<void> {
    try {
      const response = await supabase.get(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Proxima_Vacina?id_dependente=eq.${id_dependente}`,
        {
          headers: {
            apikey: supabaseApiKey,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.length > 0) {
        // Há uma próxima vacina, exclua-a
        console.log("tem proxima vacina")
        await Dependente.excluirProximaVacina(response.data[0].id_proximaVacina);
      }
    } catch (error) {
      console.error("Erro ao verificar próxima vacina:", error);
      throw error;
    }
  }

  static async excluirProximaVacina(id_proximaVacina: number): Promise<void> {
    try {
      const response = await supabase.delete(
        `https://ikxyjoeduutnzqkynsfr.supabase.co/rest/v1/Proxima_Vacina?id_proximaVacina=eq.${id_proximaVacina}`,
        {
          headers: {
            apikey: supabaseApiKey,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Próxima vacina excluída com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao excluir próxima vacina:", error);
      throw error;
    }
  }
}

export default Dependente;
