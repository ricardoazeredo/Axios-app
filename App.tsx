import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState,  } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { api } from './services/axios'

type DataTypes = {
  title: string,
  body?: string,
  userId?: number
}
export default function App() {
  const [data, setData] = useState<DataTypes>();

  useEffect(() => {
    api.get('/posts/2')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar os dados:', error);
      });
  }, []);

  const handleNewPost = async () => {
    try {
      const response = await api.post('/posts', {
        title: "Novo Post",
        body: 'Conteúdo do post',
        userId: 1,
      });
      setData(response.data)
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
      setData(response.data);
      console.log('Post atualizado:', response.data);
    } 
    )
    .catch(error => console.error('Erro ao atualizar post:', error));   
  }

//Delete
  const handleDeletePost = () => {
    axios.delete('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => {
      setData(response.data);
      console.log('Post excluído');
    }    
  )
  .catch(error => console.error('Erro ao excluir post:', error));
  }
    
  //interceptions
   const handleInterception  = () => { api.interceptors.response.use(response => {
        //console.log('Resposta recebida:', response.data);
        return response;
      }, error => {
        console.error('Erro na resposta:', error);
        return Promise.reject(error);
      });
    }
  // Cancelamento de Requisições
  const controller = new AbortController();
    
    axios.get('https://jsonplaceholder.typicode.com/posts', {
      signal: controller.signal,
    })
  .then(response => console.log(response.data))
  .catch(error => console.error('Requisição cancelada:', error));

//Cancelando a requisição:
controller.abort();

//Tratamento de Erros no Axios
axios.get('https://jsonplaceholder.typicode.com/posts/9999')
  .then(response => console.log(response.data))
  .catch(error => {
    if (error.response) {
      console.error('Erro no servidor:', error.response.status);
    } else if (error.request) {
      console.error('Sem resposta do servidor:', error.request);
    } else {
      console.error('Erro desconhecido:', error.message);
    }
  });

  

  return (
    <View style={styles.container}>
      {!data ? <Text>'Carregando...</Text> :
        <>
          <Text>Titulo: {data.title}</Text>
          <Text>Conteúdo: {data.body}</Text>     
          <Text>Autor: {data.userId}</Text> 
        </>         
      }
      <TouchableOpacity onPress={()=> {handleNewPost()}}>
        <Text>Criar post</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> {handleUpdatePost()}}>
        <Text>Atualizar post</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> {handleDeletePost()}}>
        <Text>Excluir post</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> {handleInterception()}}>
        <Text>Interceptar Requisição</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={()=> {controller.abort()}}>
        <Text>Cancelando Requisição</Text>
      </TouchableOpacity> */}
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
});
