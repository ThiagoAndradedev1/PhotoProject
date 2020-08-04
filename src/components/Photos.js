import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import CardColumns from 'react-bootstrap/CardColumns';
import { firebase, storage } from '../firebase';
import moment from 'moment';
import Spinner from '../layout/Spinner';
import Pagination from './Pagination';
import Modali, { useModali } from 'modali';

const Photos = () => {
  const [docs, setDocs] = useState([]);
  const [docToDelete, setDocToDelete] = useState();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [cancelModal, toggleCancelModal] = useModali({
    animated: true,
    title: 'Você tem certeza?',
    message: 'Esse documento ira ser deletado permanentemente.',
    buttons: [
      <Modali.Button
        label='Cancelar'
        isStyleCancel
        onClick={() => toggleCancelModal()}
      />,
      <Modali.Button
        label='Deletar'
        isStyleDestructive
        onClick={() => {
          deleteCard(docToDelete);
          toggleCancelModal();
        }}
      />,
    ],
  });
  console.log(docs.length);

  useEffect(() => {
    setLoading(true);
    firebase
      .firestore()
      .collection('information')
      .orderBy('created_at', 'desc')
      .onSnapshot((snapshot) => {
        const newInformation = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocs(newInformation);
        setLoading(false);
      });
  }, []);

  const deleteCard = (doc) => {
    firebase.firestore().collection('information').doc(doc.id).delete();
    const deletePhoto = storage.ref().child(`images/${doc.name}`);
    deletePhoto.delete();
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentDocs = docs.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (doc) => {
    setDocToDelete(doc);
    toggleCancelModal();
  };

  if (loading) return <Spinner />;

  return (
    <Container className='mt-5'>
      <CardColumns className='mt-5'>
        {currentDocs.map((doc) => (
          <Card border='dark' key={doc.id}>
            <button
              onClick={() => openModal(doc)}
              type='button'
              className='p-1 close'
              aria-label='Close'
            >
              <span aria-hidden='true'>&times;</span>
            </button>
            <Modali.Modal {...cancelModal} />

            <Card.Img variant='top' src={doc.url} />
            <Card.Body>
              <blockquote className='text-center blockquote'>
                <p className='mb-0'>{doc.descricao}</p>
              </blockquote>
            </Card.Body>
            <Card.Footer>
              <small className='text-muted'>
                {moment(doc.created_at.toDate()).format('LL')}
              </small>
            </Card.Footer>
          </Card>
        ))}
      </CardColumns>

      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={docs.length}
        paginate={paginate}
      />
    </Container>
  );
};

export default Photos;
