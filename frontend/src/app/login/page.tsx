// app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulation d'un appel d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérification simple pour la démonstration
      if (email === 'user@example.com' && password === 'password') {
        router.push('/');
      } else {
        setError('Identifiants invalides');
      }
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
              <h2 className="text-center mb-4">Connexion</h2>
              
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Entrez votre email"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Entrez votre mot de passe"
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Se souvenir de moi"
                  />
                  <a href="/forgot" className="text-decoration-none">Mot de passe oublié?</a>
                </div>
                
                <div className="d-grid gap-2">
                  <Button
                    variant="secondary"
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
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Vous n'avez pas de compte?{' '}
                  <a href="/register" className="text-decoration-none">Inscrivez-vous</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}