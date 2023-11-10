import ProximaVacina from "../Model/ProximaVacina";
class proximaVacinaController{
    static async verificacaoProxVacina(id_dependente:number, Data_Nascimento: string){
        try{
            // Obtém a data atual
            const dataAtual = new Date();

            // Converte a data de nascimento para um objeto Date
            const dataNascimento = new Date(Data_Nascimento);

            // Calcula a diferença em meses entre a data atual e a data de nascimento
            const diffMeses = Math.floor(
              (dataAtual.getFullYear() - dataNascimento.getFullYear()) * 12 +
                (dataAtual.getMonth() - dataNascimento.getMonth())
            );
            
            // Define a relação de idade, nome da vacina e dose
            const relacaoIdadeVacinaDose = [
              { idade: 0, nomeVacina: 'BCG | Vacina contra hepatite B', dose: 'dose única | 1ª dose' },
              { idade: 1, nomeVacina: 'Vacina contra hepatite B', dose: '2ª dose' },
              { idade: 2, nomeVacina: 'Vacina tetravalente (DTP + Hib) | VOP (vacina oral contra pólio) | VORH (Vacina Oral de Rotavírus Humano)', dose: '1ª dose' },
              { idade: 4, nomeVacina: 'Vacina tetravalente (DTP + Hib) | VOP (vacina oral contra pólio) | VORH (Vacina Oral de Rotavírus Humano)', dose: '2ª dose' },
              { idade: 6, nomeVacina: 'Vacina tetravalente (DTP + Hib) | VOP (vacina oral contra pólio) | Vacina contra hepatite B', dose: '3ª dose' },
              { idade: 9, nomeVacina: 'Vacina contra febre amarela', dose: 'dose inicial' },
              { idade: 12, nomeVacina: 'SRC (tríplice viral)', dose: 'dose única' },
              { idade: 15, nomeVacina: 'VOP (vacina oral contra pólio) | DTP (tríplice bacteriana)', dose: 'reforço | 1º reforço' },
              { idade: 48, nomeVacina: 'DTP (tríplice bacteriana) | SRC (tríplice viral)', dose: '2º reforço | reforço' },
              { idade: 120, nomeVacina: 'Vacina contra febre amarela', dose: 'reforço' }
              // Adicione mais entradas para outras idades e doses
            ];
        
            // Inicialize as variáveis para o nome da vacina e a dose
            let nomeVacina = '';
            let dose = '';
        
            // Encontre a próxima vacina com base na idade
            for (const vacina of relacaoIdadeVacinaDose) {
              if (diffMeses >= vacina.idade) {
                nomeVacina = vacina.nomeVacina;
                dose = vacina.dose;
              } else {
                break;
              }
            }


            console.log('Próxima vacina:', nomeVacina);
            console.log('Dose correspondente:', dose);
            const proxVacina = await ProximaVacina.verificacaoProxVacina(id_dependente, nomeVacina, dose)
            return proxVacina;
        }catch(error){
            throw error;
        }
    }
}

export default proximaVacinaController