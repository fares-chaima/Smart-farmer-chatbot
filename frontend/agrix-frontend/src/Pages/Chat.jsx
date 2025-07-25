import React, { useState, useRef, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DocumentIcon from '@mui/icons-material/Description';
import '../styles/Chat.css';


const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      content: "Hello! I'm your AgriX assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Nouvelle conversation', date: 'Aujourd\'hui' }
  ]);
  const [activeConversation, setActiveConversation] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Effet pour faire défiler vers le bas automatiquement
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' && uploadedFiles.length === 0) return;
  
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      files: uploadedFiles
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
  
    try {
      let response;
      if (uploadedFiles.length > 0) {
        // Créer un formData pour envoyer les fichiers
        const formData = new FormData();
        uploadedFiles.forEach((file) => {
          formData.append('image', file); // clé 'image' doit correspondre au backend
        });
  
        if (inputValue.trim() !== '') {
          formData.append('text', inputValue); // Ajoute le texte si présent
        }
  
        response = await fetch('http://localhost:8000/api/plantid/', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Envoi normal si texte uniquement
        response = await fetch('http://localhost:8000/api/ask/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: inputValue }),
        });
      }
  
      if (!response.ok) {
        throw new Error('Erreur dans la requête');
      }
  
      const data = await response.json();
  
const aiMessage = {
  id: Date.now() + 1,
  sender: 'ai',
  content: data.report || data.response || "Pas de réponse",
  timestamp: new Date().toLocaleTimeString(),
};

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API :", error);
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'ai',
        content: "Erreur lors de la communication avec le serveur.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  

  const getAssistantResponse = (userInput) => {
    // Logique simple de réponse (pourrait être remplacée par une API)
    const input = userInput.toLowerCase();
    
    if (input.includes('fichier') || input.includes('joint')) {
      return 'J\'ai bien reçu votre fichier. Je vais l\'analyser et vous répondre dans quelques instants.';
    } else if (input.includes('bonjour') || input.includes('salut')) {
      return 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
    } else if (input.includes('merci')) {
      return 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.';
    } else if (input.includes('blé') || input.includes('céréale')) {
      return 'Pour les cultures de blé, je recommande de surveiller les signes de rouille foliaire et d\'appliquer un fongicide préventif si nécessaire.';
    } else if (input.includes('maladie') || input.includes('santé')) {
      return 'Pouvez-vous me décrire les symptômes que vous observez ou partager une photo de la plante concernée ?';
    } else {
      return 'Je suis un assistant spécialisé en agriculture. Pour une réponse plus précise, pourriez-vous reformuler votre question ou fournir plus de détails ?';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewConversation = () => {
    const newConversation = {
      id: conversations.length + 1,
      title: `Nouvelle conversation ${conversations.length + 1}`,
      date: 'Aujourd\'hui'
    };
    setConversations([...conversations, newConversation]);
    setActiveConversation(newConversation.id);
    setMessages([{
      id: 1,
      sender: 'assistant',
      content: 'Bonjour ! Je suis votre assistant AgriX. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const deleteConversation = (id, e) => {
    e.stopPropagation();
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    setConversations(updatedConversations);
    
    if (activeConversation === id) {
      if (updatedConversations.length > 0) {
        setActiveConversation(updatedConversations[0].id);
        setMessages([{
          id: 1,
          sender: 'assistant',
          content: 'Bonjour ! Je suis votre assistant AgriX. Comment puis-je vous aider aujourd\'hui ?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        startNewConversation();
      }
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      return validTypes.includes(file.type);
    });
    
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
    } else {
      alert('Seuls les fichiers JPEG, PNG, GIF, PDF et texte sont autorisés.');
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon />;
    } else if (file.type === 'application/pdf') {
      return <PictureAsPdfIcon />;
    } else {
      return <DocumentIcon />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const triggerFileInput = (fileType = '*') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = fileType === 'image' ? 'image/*' : fileType === 'pdf' ? 'application/pdf' : '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* Bouton mobile pour ouvrir la sidebar */}
      {!isSidebarOpen && (
  <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
    <MenuIcon />
  </button>
)}
      
      {/* Sidebar */}
      <div className="sidebar" >
        <div className="sidebar-header">
          <button 
            className="new-chat-btn" 
            onClick={startNewConversation}
          >
            + Nouvelle conversation
          </button>
          
        </div>
        
        <div className="conversation-list">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              className={`conversation-item ${activeConversation === conv.id ? 'active' : ''}`}
              onClick={() => setActiveConversation(conv.id)}
            >
              <span className="conv-title">{conv.title}</span>
              <span className="conv-date">{conv.date}</span>
              <button 
                className="delete-conv-btn"
                onClick={(e) => deleteConversation(conv.id, e)}
              >
                <DeleteIcon fontSize="small" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="sidebar-footer">
          <button className="settings-btn">
            <SettingsIcon />
            Paramètres
          </button>
          <button 
            className="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            <Brightness4Icon />
            {darkMode ? 'Mode clair' : 'Mode sombre'}
          </button>
          <div className="user-profile">
            <AccountCircleIcon />
            <span>Utilisateur</span>
          </div>
        </div>
      </div>
      
      {/* Chat area */}
      <div className="chat-container">
      
        <div className="chat-header">
         
          <h2>Plant Disease Detection Chat</h2>
        </div>
        
        <div className="chat-messages">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.sender}`}
            >
              <div className="message-avatar">
                {message.sender === 'user' ? (
                  <AccountCircleIcon fontSize="large" />
                ) : (
                  <div className="ai-avatar">Ai</div>
                )}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">
                    {message.sender === 'user' ? 'Vous' : 'AgriX'}
                  </span>
                  <span className="timestamp">{message.timestamp}</span>
                </div>
                <div className="message-text">
                  {message.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                {message.files && message.files.length > 0 && (
                  <div className="message-files">
                    {message.files.map((file, index) => (
                      <div key={index} className="uploaded-file-preview">
                        {getFileIcon(file)}
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Zone des fichiers attachés */}
        {uploadedFiles.length > 0 && (
          <div className="upload-preview-container">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="uploaded-file-preview">
                {getFileIcon(file)}
                <span>{file.name}</span>
                <button className="remove-file-btn" onClick={() => removeFile(index)}>
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Input file caché */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          multiple
        />
        
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <button 
              className="attach-btn"
              onClick={() => triggerFileInput('image')}
              title="Ajouter une image"
            >
              <ImageIcon />
            </button>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Envoyez un message..."
              rows="1"
            />
            <button 
              className="send-btn"
              onClick={handleSendMessage}
              disabled={inputValue.trim() === '' && uploadedFiles.length === 0}
              title="Envoyer"
            >
              <SendIcon />
            </button>
          </div>
          <div className="input-footer">
            <span>AgriX peut faire des erreurs. Vérifiez les informations importantes.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;