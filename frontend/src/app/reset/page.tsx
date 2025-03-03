// app/reset-password/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Vérifier si le token est présent
  if (!token) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card className="shadow border-0">
              <Card.Body className="p-4">
                <Alert variant="danger">
                  <Alert.Heading>Lien invalide</Alert.Heading>
                  <p>
                    Le lien de réinitialisation de mot de passe est invalide ou a expiré.
                    Veuillez faire une nouvelle demande de réinitialisation.
                  </p>
                  <div className="d-flex justify-content-center mt-3">
                    <Button variant="primary" href="/forgot">
                      Demander un nouveau lien
                    </Button>
                  </div>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Vérification des mots de passe
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ici, vous implémenteriez un véritable appel API à votre backend
      // pour réinitialiser le mot de passe avec le token
      
      setSuccess(true);
      // Redirection après 3 secondes
      setTimeout(() => {
        router.push('/login');
      }, 3000);
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
              <h2 className="text-center mb-4">Définir un nouveau mot de passe</h2>
              
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}
              
              {success ? (
                <Alert variant="success">
                  <Alert.Heading>Mot de passe mis à jour!</Alert.Heading>
                  <p>
                    Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé 
                    vers la page de connexion.
                  </p>
                  <div className="d-flex justify-content-center mt-3">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Redirection...</span>
                    </Spinner>
                  </div>
                </Alert>
              ) : (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Nouveau mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Entrez votre nouveau mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      pattern=".{8,}"
                    />
                    <Form.Text className="text-muted">
                      Le mot de passe doit contenir au moins 8 caractères.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      Le mot de passe doit contenir au moins 8 caractères.
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label>Confirmer le mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirmez votre nouveau mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Veuillez confirmer votre mot de passe.
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
                          Réinitialisation en cours...
                        </>
                      ) : (
                        'Réinitialiser le mot de passe'
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}