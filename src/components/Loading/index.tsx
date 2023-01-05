import { Container, LoadIndicator } from './styles';

export function Loading() {
  return (
    <Container>
      <LoadIndicator size={30} />
    </Container>
  );
}