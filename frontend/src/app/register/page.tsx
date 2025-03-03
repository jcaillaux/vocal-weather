// app/signup/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Validation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ici, vous implémenteriez un véritable appel API à votre backend
      // pour créer le compte utilisateur
      
      // Redirection vers la page de login après inscription réussie
      router.push('/login?registered=true');
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
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
              <h2 className="text-center mb-4">Créer un compte</h2>
              
              {error && (<Alert variant="danger"> {error} </Alert>)}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>

                <Form.Group className="mb-3" controlId="userName">
                    <Form.Label>Nom d'utilisateur</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Veuillez saisir votre nom d'utilisateur.
                    </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="exemple@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez saisir une adresse email valide.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
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
                    placeholder="Confirmer le mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez confirmer votre mot de passe.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button
                    variant="dark"
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
                        Inscription en cours...
                      </>
                    ) : (
                      'S\'inscrire'
                    )}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Vous avez déjà un compte?{' '}
                  <a href="/login" className="text-decoration-none">Connectez-vous</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}