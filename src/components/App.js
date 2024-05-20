import './css/App.css';
import {BrowserRouter as Router,Route,Switch , Redirect} from 'react-router-dom';

import { nanoid } from 'nanoid';
import React, {useState , useEffect} from "react";
import AddContact from "./AddContact";
import EditContact from "./EditContact";
import ContactList from "./ContactList";


function App() {

  const LOCAL_STORAGE_KEY = "cont";
  const [contacts , setContacts] = useState([]);  
  const [searchTerm , setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  

  const addContactHandler = async (contact) => {
    const newContact ={
      id : nanoid(), 
      ...contact,
    };

    setContacts([...contacts, newContact]);
  };

  const updateContactHandler = async (UpdateContact) => {
    const updatedContact = contacts.map((contact) =>{
      return contact.id === UpdateContact.id ? UpdateContact : contact;
  });

      setContacts(updatedContact);
  };

  const removeContactHandler = async (id) => {
       
      const remainContacts = contacts.filter((contact) => {
        return contact.id !== id;
      });

          setContacts(remainContacts);
      
    };

    const serachHandler = (searchTerm) => 
    {
             setSearchTerm(searchTerm);
             if(searchTerm !== "")
              {
                const newContactList = contacts.filter((contact) =>
                  {
                    return  Object.values(contact)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                  });
                  setSearchResults(newContactList);

              }
              else{
                setSearchResults(contacts);
              }
    };

    

    // useEffect is used to perform the side effect in the functional component
    // here side effect is localStorage

    useEffect( ( ) => {

      const retrivedContact=JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
      if(retrivedContact)
        {
          setContacts(retrivedContact);
        }
      }, []);

    useEffect( ( ) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
    }, [contacts]); 
    // dependecy array. it tells React to run the effect only when the contacts state change

  
  
    return (
      <div>
          <Router>
            <Switch>

            <Route 
              exact
              path="/add" 
              render={() =>(
              <AddContact 
              addContactHandler = {addContactHandler} 
              />
              )}
              />

              <Route 
              exact
              path="/edit" 
              render={(props) =>(
              <EditContact 
               updateContactHandler = {updateContactHandler} 
              contact={props.location.state.contact}
              />
              )}
              />

            <Route 
              path="/list" 
              render={() => (
              <ContactList 
              contacts = {searchTerm.length < 1 ?  contacts : searchResults} 
              removeContactHandler = {removeContactHandler}
              searchTerm = { searchTerm }
              serachHandler = {serachHandler}

             

              />
              )}
              />

<Redirect to="/list" />

              {/* <AddContact addContactHandler = {addContactHandler} />
              <ContactList contacts = {contacts} removeContactHandler = {removeContactHandler} /> */}
            
            </Switch>
          </Router>
      </div>
  );
}

export default App;


