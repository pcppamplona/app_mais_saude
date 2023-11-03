import Remedio from "../Model/Remedio";


class RemedioController{
    static async BuscarRemedios(id_usuario:number){
      try {
        const remedios = await Remedio.BuscarRemedios(id_usuario);
        return remedios;
      } catch (error) {
        throw error;
      }
    }

    static async CriarRemedio(id_usuario:number, nomeRemedio:string, horarioInicial:string, quantidadeDias:number, frequencia:string, id_remedio?:number){
      function calcularFrequenciaEmSegundos(frequencia) {
        const partes = frequencia.split(":");
        if (partes.length !== 3) {
          throw new Error("Formato de frequência inválido. Use hh:mm:ss");
        }
      
        const horas = parseInt(partes[0], 10);
        const minutos = parseInt(partes[1], 10);
        const segundos = parseInt(partes[2], 10);
      
        const frequenciaEmSegundos = horas * 3600 + minutos * 60 + segundos;
        return frequenciaEmSegundos;
      }

      function calcularDataFinal(
        horarioInicialString, // no formato hh:mm:ss
        quantidadeDias,
        frequenciaString // no formato hh:mm:ss
      ) {
        // Separe o horário em horas, minutos e segundos
        const [horasInicial, minutosInicial, segundosInicial] = horarioInicialString.split(":");
      
        const segundosIniciais = parseInt(horasInicial) * 3600 + parseInt(minutosInicial) * 60 + parseInt(segundosInicial);
      
        // Separe a frequência em horas, minutos e segundos
        const [horasFrequencia, minutosFrequencia, segundosFrequencia] = frequenciaString.split(":");
        const segundosdaFrequencia = parseInt(horasFrequencia) * 3600 + parseInt(minutosFrequencia) * 60 + parseInt(segundosFrequencia);
        const totalSegundos = quantidadeDias * segundosdaFrequencia;
      
        // Calcular o horário da última dose em segundos
        const horarioFinalSegundos = segundosIniciais + totalSegundos;
      
        // Converter o horário final em um objeto Date
        const horarioFinalDate = new Date();
        horarioFinalDate.setSeconds(horarioFinalSegundos);
      
        // Formate a data no formato "yyyy/mm/dd"
        const year = horarioFinalDate.getFullYear();
        const month = String(horarioFinalDate.getMonth() + 1).padStart(2, "0");
        const day = String(horarioFinalDate.getDate()).padStart(2, "0");
        const dataFormatada = `${year}-${month}-${day}`;
      
        return dataFormatada;
      }

      const valorFrequencia =  calcularFrequenciaEmSegundos(frequencia);
      console.log(valorFrequencia)

      let qntd_total = (quantidadeDias*24*60*60)/valorFrequencia
      console.log(qntd_total)

      const dataFinal = calcularDataFinal(horarioInicial, quantidadeDias, frequencia);
      console.log("Data-final:"+dataFinal);

      const Doses_Atrasadas = 0;
      //let Qntd_DosesRestantes = qntd_total;
      qntd_total = 3;
      let Qntd_DosesRestantes = qntd_total;

      const status = false;
      
      const remedio = new Remedio(id_usuario, nomeRemedio, horarioInicial, quantidadeDias, frequencia, Doses_Atrasadas, Qntd_DosesRestantes, qntd_total, dataFinal, status)
      remedio.cadastrarRemedio(id_usuario, nomeRemedio, horarioInicial, quantidadeDias, frequencia, Doses_Atrasadas, Qntd_DosesRestantes, qntd_total, dataFinal, status);
      return remedio;
    }

    static async BuscarRemedioId(id_remedio:number){
      try {
        const remedio = await Remedio.BuscarRemedioId(id_remedio);
        return remedio;
      } catch (error) {
        throw error;
      }
    }


    static async EditarRemedio(id_usuario:number, id_remedio:number, nomeRemedio:string, horarioInicial:string, quantidadeDias:number, frequencia:string){
      function calcularFrequenciaEmSegundos(frequencia) {
        const partes = frequencia.split(":");
        if (partes.length !== 3) {
          throw new Error("Formato de frequência inválido. Use hh:mm:ss");
        }
      
        const horas = parseInt(partes[0], 10);
        const minutos = parseInt(partes[1], 10);
        const segundos = parseInt(partes[2], 10);
      
        const frequenciaEmSegundos = horas * 3600 + minutos * 60 + segundos;
        return frequenciaEmSegundos;
      }

      function calcularDataFinal(
        horarioInicialString, // no formato hh:mm:ss
        quantidadeDias,
        frequenciaString // no formato hh:mm:ss
      ) {
        // Separe o horário em horas, minutos e segundos
        const [horasInicial, minutosInicial, segundosInicial] = horarioInicialString.split(":");
      
        const segundosIniciais = parseInt(horasInicial) * 3600 + parseInt(minutosInicial) * 60 + parseInt(segundosInicial);
      
        // Separe a frequência em horas, minutos e segundos
        const [horasFrequencia, minutosFrequencia, segundosFrequencia] = frequenciaString.split(":");
        const segundosdaFrequencia = parseInt(horasFrequencia) * 3600 + parseInt(minutosFrequencia) * 60 + parseInt(segundosFrequencia);
        const totalSegundos = quantidadeDias * segundosdaFrequencia;
      
        // Calcular o horário da última dose em segundos
        const horarioFinalSegundos = segundosIniciais + totalSegundos;
      
        // Converter o horário final em um objeto Date
        const horarioFinalDate = new Date();
        horarioFinalDate.setSeconds(horarioFinalSegundos);
      
        // Formate a data no formato "yyyy/mm/dd"
        const year = horarioFinalDate.getFullYear();
        const month = String(horarioFinalDate.getMonth() + 1).padStart(2, "0");
        const day = String(horarioFinalDate.getDate()).padStart(2, "0");
        const dataFormatada = `${year}-${month}-${day}`;
      
        return dataFormatada;
      }

      const valorFrequencia =  calcularFrequenciaEmSegundos(frequencia);
      console.log(valorFrequencia)

      let qntd_total = (quantidadeDias*24*60*60)/valorFrequencia
      console.log(qntd_total)

      const dataFinal = calcularDataFinal(horarioInicial, quantidadeDias, frequencia);
      console.log("Data-final:"+dataFinal);

      const Doses_Atrasadas = 0;
      //let Qntd_DosesRestantes = qntd_total;
      qntd_total = 3;
      let Qntd_DosesRestantes = qntd_total;
      const status = false;
      
      
      Remedio.editarRemedio(id_usuario, id_remedio, nomeRemedio, horarioInicial, quantidadeDias, frequencia, Doses_Atrasadas, Qntd_DosesRestantes, qntd_total, dataFinal, status);
    }

    static async excluirRemedio(id_usuario:number, id_remedio:number){
      try{
        Remedio.excluirRemedio(id_usuario, id_remedio)
      }catch{
        console.log("Erro ao excluir remédio")
      }
    }

    static async BuscarUltimoRemedio(){
      try{
        const ultimoRemedio = await Remedio.BuscarUltimoRemedio();
        return ultimoRemedio;
      }catch(error){
        console.error("Erro no controller", error);
        throw error;
      }
    }

    static async atualizarQntdDosesRestantes(id_remedio:number, valor:number){
      try{
        const atulizadoDosesRestantes = Remedio.atualizarQntdDosesRestantes(id_remedio, valor)
      }catch(error){
        console.error("Erro no controller", error);
        throw error;
      }
    }
}

export default RemedioController