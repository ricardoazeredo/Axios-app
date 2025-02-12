import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState,  } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { api } from './services/axios'

type DataTypes = {
  id: string,
  title: string,
  body?: string,
  userId?: number,
  lenght: number
}
export default function App() {
  const [dados, setDados] = useState<DataTypes[]>();
 const getPosts = async() => {
   try {
    const response = await api.get('/posts');
    setDados(response.data);
   } catch(error){
    console.error('Erro ao buscar os dados:', error);
   }
 }
  useEffect(() => {
    getPosts()
  }, []);

  const handleNewPost = async () => {
    try {
      const response = await api.post('/posts', {
        title: "Novo Post",
        body: 'Conteúdo do post',
        userId: 1,
      });
      setDados(response.data)
      console.log("Post criado", response.data);      
    } catch (error){
      console.log('Erro ao criar post',error);      
    }
  };

//Update
  const handleUpdatePost = () => {
      api.put('/posts/1', {
      title: 'Post Atualizado',
      body: 'Novo conteúdo',
      userId: 1
    })
    .then(response => {
      setDados(response.data);
      console.log('Post atualizado:', response.data);
    } 
    )
    .catch(error => console.error('Erro ao atualizar post:', error));   
  }

//Delete
  const handleDeletePost = () => {
    axios.delete('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => {
      setDados(response.data);
      console.log('Post excluído');
    }    
  )
  .catch(error => console.error('Erro ao excluir post:', error));
  }
    
  //interceptions
  //  const handleInterception  = () => { api.interceptors.response.use(response => {
  //       //console.log('Resposta recebida:', response.data);
  //       return response;
  //     }, error => {
  //       console.error('Erro na resposta:', error);
  //       return Promise.reject(error);
  //     });
  //   }
  // Cancelamento de Requisições
//   const controller = new AbortController();
    
//     axios.get('https://jsonplaceholder.typicode.com/posts', {
//       signal: controller.signal,
//     })
//   .then(response => console.log(response.data))
//   .catch(error => console.error('Requisição cancelada:', error));

// //Cancelando a requisição:
// controller.abort();

//Tratamento de Erros no Axios
// axios.get('https://jsonplaceholder.typicode.com/posts/9999')
//   .then(response => console.log(response.data))
//   .catch(error => {
//     if (error.response) {
//       console.error('Erro no servidor:', error.response.status);
//     } else if (error.request) {
//       console.error('Sem resposta do servidor:', error.request);
//     } else {
//       console.error('Erro desconhecido:', error.message);
//     }
//   });
console.log(dados);
  

  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.header}>
        <Text style={styles.textHeader}>Posts!</Text>
      </View>
      
      {!dados ? <Text>'Carregando...</Text> :
        <FlatList         
          data= {dados}
          renderItem={({item}) => 
            <View style={styles.itens}>
              <Text style={styles.itemText}>Titulo: {item.title}</Text>
              <Text style={styles.itemText}>Conteúdo: {item.body}</Text>     
              <Text style={styles.itemText}>Autor: {item.userId}</Text>
            </View>
          }
          keyExtractor={item => item.id} 
        
        />
           
               
      }
      <View style={styles.btns}>
        <TouchableOpacity style={styles.btn} onPress={()=> {handleNewPost()}}>
          <Text style={styles.btnText}>Criar post</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=> {handleUpdatePost()}}>
          <Text style={styles.btnText}>Atualizar post</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=> {handleDeletePost()}}>
          <Text style={styles.btnText}>Excluir post</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.btn} onPress={()=> {handleInterception()}}>
          <Text style={styles.btnText}>Interceptar Requisição</Text>
        </TouchableOpacity>  */}
        {/* <TouchableOpacity style={styles.btn} onPress={()=> {controller.abort()}}>
          <Text style={styles.btnText}>Cancelando Requisição</Text>
        </TouchableOpacity> */}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2f00cc',
    padding: 24,
    marginBottom: 10    
  },
  textHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  itens: {
    backgroundColor: '#ccc',
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 5
  },
  itemText: {
    marginVertical: 8
  },
  btns: {
    paddingInline: 8,
    flexDirection:'row',
    height: 64  
  },
  btn: {
    margin: 16,
    
  },
  btnText : {
    color: '#2f00cc',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
