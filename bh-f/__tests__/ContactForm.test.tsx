import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from '@/app/components/ContactForm';
import '@testing-library/jest-dom';

beforeEach(() => {
  (window as any).grecaptcha = {
    getResponse: jest.fn(() => 'mocked-captcha-token'),
    reset: jest.fn(),
  };

  global.fetch = jest.fn();
});

test('успешно отправляет форму и показывает сообщение с благодарностью', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({}),
  });

  render(<ContactForm />);

  fireEvent.change(screen.getByPlaceholderText('Ваше имя'), { target: { value: 'Светлана' } });
  fireEvent.change(screen.getByPlaceholderText('Телефон'), { target: { value: '+79998887766' } });
  fireEvent.change(screen.getByPlaceholderText('Сообщение'), { target: { value: 'Хочу проконсультироваться по услугам==' } });

  fireEvent.click(screen.getByRole('button', { name: /отправить/i }));

  await waitFor(() => {
    expect(screen.getByText(/спасибо/i)).toBeInTheDocument();
  });
});
