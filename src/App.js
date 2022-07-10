import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function Header(props){
  return <header>
  <h1><a href="/" onClick={(event) =>{
    event.preventDefault();
    props.onChangeMode();
  }}>{props.title}</a></h1>
</header>
}

function Nav(props){
  const lis = []
  for(let i =0; i<props.topics.length; i++)
  {
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'t.id'} onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
    }}>{t.title}</a></li>)
  }
  return <nav>
  <ol>
   {lis}
  </ol>
</nav>
}

function Article(props){
  return <article>
        <h2>{props.title} </h2>
        {props.body}
      </article>

}

function Create(props){
  return <article>
      <h2>Create</h2>
      <form onSubmit={event=> {
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
        
      }}>
        <p><input type ="text" name="title" placeholder="title"/></p>
        <p><textarea name="body" placeholder="body"></textarea></p>
        <p><input type="submit" name="Create"/></p>
      </form>
  </article>
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return <article>
  <h2>Update</h2>
  <form onSubmit={event=> {
    event.preventDefault();
    const title = event.target.title.value;
    const body = event.target.body.value;
    props.onUpdate(title, body);
    
  }}>
    <p><input type ="text" name="title" value={title} onChange={event=>{
      console.log(event.target.value);
      setTitle(event.target.value);
    }}/></p>
    <p><textarea name="body" value ={body} onChange={event => {
      setBody(event.target.value);
    }}></textarea></p>
    <p><input type="submit" name="Create"/></p>
  </form>
</article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [useStateId, setId] = useState(null);
  const [nextid, setNextId] = useState(4);
  const [topics,setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ])

  let content = null;
  let contextControl = null;

  if(mode == "WELCOME")
  {
    content = <Article title="Welcome" body="Hello WEB"></Article>
  }
  else if(mode == "READ"){
    let title, body = null;
    for(let i =0; i<topics.length; i++)
    {
      if(topics[i].id == useStateId)
      {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl =<> <li><a href={'/update/'+useStateId} onClick={(event)=>{
      event.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>
    <li>
      <input type="button" value="Delete" onClick={()=>{
        const newTopics= []
        for(let i=0; i<topics.length; i++)
        {
          if(topics[i].id != useStateId)
          {
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');

      }}></input>
    </li>
    </>
  }
  else if(mode == "CREATE"){
    content = <Create onCreate={(_title, _body) => {
      const newTopic = {id : nextid, title:_title, body:_body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextid);
      setNextId(nextid+1);
    }}></Create>
  }
  else if(mode == "UPDATE"){
    let title, body = null;
    for(let i =0; i<topics.length; i++)
    {
      if(topics[i].id == useStateId)
      {
        title = topics[i].title;
        body = topics[i].body;
      }
    }

    content=<Update title={title} body={body} onUpdate={(title, body)=>{
      const updatedTopic = {id:useStateId, title:title, body:body}
      const newTopic = [...topics];
      for(let i =0; i<newTopic.length; i++)
      {
        if(newTopic[i].id == useStateId)
        {   
          newTopic[i] = updatedTopic; 
          break;
        }
      }
      setTopics(newTopic);
      setMode('READ');
      
    }}></Update>
  }
  return (
    <div className="App">
      <Header title="REACT" onChangeMode={()=>{ 
        alert('Header');
        setMode('WELCOME');
    }}></Header>
      <Nav topics={topics} onChangeMode = {(_id) => {
        alert(_id);
        setMode('READ');  
        setId(_id);
      }}></Nav> 
      {content}
      <ul>
      <li><a href="/create" onClick = {(event) => {
        event.preventDefault();
        setMode('CREATE');
      }}>Create</a></li>
      {contextControl}
      </ul>
    </div>
  );
}

export default App;
