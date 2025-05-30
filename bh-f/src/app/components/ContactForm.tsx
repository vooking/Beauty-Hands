'use client';

import { useState, useCallback, useEffect } from 'react';
import styles from "@/app/page.module.css";
import "@/app/globals.css";

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '+7', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка скрипта reCAPTCHA v2
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[а-яА-ЯёЁa-zA-Z\s]*$/.test(value)) {
      setForm(prev => ({ ...prev, name: value }));
      if (success) setSuccess(false);
      if (error) setError(null);
    }
  }, [success, error]);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^\d+]/g, '');
    
    if (cleanedValue.startsWith('+7') && cleanedValue.length <= 12) {
      setForm(prev => ({ ...prev, phone: cleanedValue }));
      if (success) setSuccess(false);
      if (error) setError(null);
    } else if (cleanedValue === '+' || cleanedValue === '') {
      setForm(prev => ({ ...prev, phone: '+7' }));
    }
  }, [success, error]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, message: e.target.value }));
    if (success) setSuccess(false);
    if (error) setError(null);
  }, [success, error]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.phone.length !== 12) {
      setError('Номер телефона должен содержать 11 цифр (включая +7)');
      return;
    }

    // Получаем токен reCAPTCHA
    const captchaToken = (document.querySelector(
      '.g-recaptcha textarea[name="g-recaptcha-response"]'
    ) as HTMLTextAreaElement)?.value;

    if (!captchaToken) {
      setError('Пожалуйста, подтвердите, что вы не робот');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-token',
        },
        body: JSON.stringify({ ...form, 'g-recaptcha-response': captchaToken }),
      });

      if (!response.ok) throw new Error('Ошибка при отправке');

      setForm({ name: '', phone: '+7', message: '' });
      setSuccess(true);
      // Сброс reCAPTCHA после успешной отправки
      (window as any).grecaptcha?.reset();
    } catch {
      setError('Не удалось отправить сообщение. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 space-y-6 p-4 border rounded-xl shadow bg-white">
      <h2 className={`text-2xl font-semibold text-center ${styles.titleMain}`}>Форма обратной связи</h2>

      <input
        type="text"
        name="name"
        placeholder="Ваше имя"
        value={form.name}
        onChange={handleNameChange}
        className="w-full p-3 border rounded"
        required
        pattern="[а-яА-ЯёЁa-zA-Z\s]+"
        title="Только буквы (русские или английские)"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Телефон"
        value={form.phone}
        onChange={handlePhoneChange}
        className="w-full p-3 border rounded"
        required
        pattern="\+7\d{10}"
        title="Формат: +7XXXXXXXXXX (11 цифр)"
      />

      <textarea
        name="message"
        placeholder="Сообщение"
        value={form.message}
        onChange={handleMessageChange}
        className="w-full p-3 border rounded h-32"
        required
      />

      {/* reCAPTCHA v2 */}
      <div className="g-recaptcha" data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}></div>

      <button
        type="submit"
        disabled={loading}
        className="w-full border border-gray-600 text-gray-800 text-[20px] px-10 py-3 rounded-[10px] hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Отправка...' : 'Отправить'}
      </button>

      {success && (
        <p className="text-green-600 text-center font-medium" role="alert" aria-live="polite">
          Спасибо! Мы свяжемся с вами в ближайшее время.
        </p>
      )}

      {error && (
        <p className="text-red-600 text-center font-medium" role="alert" aria-live="assertive">
          {error}
        </p>
      )}
    </form>
  );
}
