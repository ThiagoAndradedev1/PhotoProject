import React, { Fragment, useState, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { storage, firebase } from '../firebase';

const Input = () => {
  const myImage = useRef(undefined);
  const [descricao, setDescricao] = useState('');
  const [ShowLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    const image = myImage.current.files[0];
    if (image === undefined || descricao === '') {
      setShowError(true);
    } else {
      try {
        setShowError(false);
        setShowLoading(true);
        await storage.ref(`images/${image.name}`).put(image);
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            firebase.firestore().collection('information').add({
              url,
              descricao,
              name: image.name,
              created_at: new Date(),
            });
          });
        myImage.current.value = '';
        setShowLoading(false);
        setDescricao('');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Fragment>
      <Container>
        <div className='row'>
          <div className='col-md-6 offset-md-3'>
            <Card border='dark' className='mt-4'>
              <Card.Body>
                <Form onSubmit={handleUpload}>
                  <Form.Group controlId='exampleForm.ControlTextarea1'>
                    <h6 className='text-center'>Descrição:</h6>
                    <Form.Control
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      as='textarea'
                      rows='3'
                    />
                  </Form.Group>
                  <div className='mb-3'>
                    <Form.File id='formcheck-api-regular'>
                      <Form.File.Label>Regular file input</Form.File.Label>
                      <Form.File.Input ref={myImage} />
                    </Form.File>
                  </div>
                  <div className='mb-3 text-center'>
                    <Button variant='dark' type='submit'>
                      Enviar
                    </Button>
                  </div>
                </Form>
                {ShowLoading && (
                  <div className='progress-bar'>
                    <div className='progress-bar-value'></div>
                  </div>
                )}
                {showError && (
                  <div className='m-4 alert alert-danger' role='alert'>
                    Você deve selecionar uma foto e uma descrição!
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Input;
