// app/forgot-password/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ici, vous implémenteriez un véritable appel API à votre backend
      // pour envoyer un email de réinitialisation de mot de passe
      
      setSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <Card className="shadow border-0">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Réinitialisation du mot de passe</h2>
              
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}
              
              {success ? (
                <Alert variant="success">
                  <Alert.Heading>Email envoyé!</Alert.Heading>
                  <p>
                    Si un compte existe avec l'adresse {email}, vous recevrez bientôt un email 
                    contenant les instructions pour réinitialiser votre mot de passe.
                  </p>
                  <div className="d-flex justify-content-center mt-3">
                    <Button variant="outline-primary" href="/login">
                      Retour à la connexion
                    </Button>
                  </div>
                </Alert>
              ) : (
                <>
                  <p className="text-muted text-center mb-4">
                    Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
                  
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-4" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="exemple@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Veuillez saisir une adresse email valide.
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        className="py-2"
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Envoi en cours...
                          </>
                        ) : (
                          'Envoyer le lien de réinitialisation'
                        )}
                      </Button>
                    </div>
                  </Form>
                </>
              )}
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  <a href="/login" className="text-decoration-none">
                    <i className="bi bi-arrow-left"></i> Retour à la connexion
                  </a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}