'use client';

import { useEffect, useState } from 'react';
import AdminNavbar from '@/app/components/AdminNavbar';
import withAuth from '@/app/components/withAuth';

const categories = [
    "Наращивание ногтей",
    "Маникюр",
    "Педикюр",
    "Брови и ресницы",
    "Лицо",
    "Массаж",
    "Препаратный педикюр KART",
    "Комплексы",
    "Пирсинг",
    "Депиляция",
];

const Services = () => {
    const [services, setServices] = useState<any[]>([]);
    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Все');
    const [form, setForm] = useState({
        id: null as number | null,
        category: categories[0],
        name: '',
        priceMaster: '',
        priceTopMaster: '',
        hasTopMasterPrice: false
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchServices = () => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setServices(data);
                setFilteredServices(data);
            })
            .catch(() => alert('Ошибка загрузки услуг'));
    };

    useEffect(() => { 
        fetchServices(); 
    }, []);

    useEffect(() => {
        if (selectedCategory === 'Все') {
            setFilteredServices(services);
        } else {
            const filtered = services.filter(service => service.category === selectedCategory);
            setFilteredServices(filtered);
        }
    }, [selectedCategory, services]);

    const parsePrice = (prices: any) => {
        if (!prices) return '-';
        
        try {
            const parsed = typeof prices === 'string' ? JSON.parse(prices) : prices;
            
            if (parsed.topMaster) {
                return `Мастер: ${parsed.master} ₽, Топ-мастер: ${parsed.topMaster} ₽`;
            }
            return `${parsed.master} ₽`;
        } catch {
            return `${prices} ₽`;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.checked });
    };

    const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const prices: any = { master: form.priceMaster };
            
            if (form.hasTopMasterPrice && form.priceTopMaster) {
                prices.topMaster = form.priceTopMaster;
            }

            const url = isEditing 
                ? `${process.env.NEXT_PUBLIC_API_URL}/admin/services/${form.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/admin/services`;
            
            const method = isEditing ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    category: form.category,
                    name: form.name,
                    prices: JSON.stringify(prices)
                })
            });
            
            resetForm();
            fetchServices();
        } catch (e) {
            alert(`Ошибка при ${isEditing ? 'редактировании' : 'добавлении'}`);
        }
    };

    const handleEdit = (service: any) => {
        const prices = typeof service.prices === 'string' ? JSON.parse(service.prices) : service.prices;
        
        setForm({
            id: service.id,
            category: service.category,
            name: service.name,
            priceMaster: prices.master || '',
            priceTopMaster: prices.topMaster || '',
            hasTopMasterPrice: !!prices.topMaster
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem('token');
        if (confirm('Удалить услугу?')) {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchServices();
        }
    };

    const resetForm = () => {
        setForm({
            id: null,
            category: categories[0],
            name: '',
            priceMaster: '',
            priceTopMaster: '',
            hasTopMasterPrice: false
        });
        setIsEditing(false);
    };

    return (
        <>
            <AdminNavbar />
            <main className="p-6 max-w-4xl mx-auto text-[#4b4845]">
                <h1 className="text-2xl font-semibold mb-6">Управление услугами</h1>

                {/* Форма добавления/редактирования */}
                <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                    <div>
                        <label className="block mb-1 font-medium">Категория</label>
                        <select 
                            name="category" 
                            value={form.category} 
                            onChange={handleChange} 
                            className="border p-2 w-full rounded"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Название услуги</label>
                        <input 
                            name="name" 
                            value={form.name} 
                            onChange={handleChange} 
                            required 
                            className="border p-2 w-full rounded" 
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Цена мастера (₽)</label>
                        <input 
                            name="priceMaster" 
                            value={form.priceMaster} 
                            onChange={handleChange} 
                            required 
                            type="number"
                            className="border p-2 w-full rounded" 
                            placeholder="Введите цену"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="topMasterPrice"
                            name="hasTopMasterPrice"
                            checked={form.hasTopMasterPrice}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4"
                        />
                        <label htmlFor="topMasterPrice" className="font-medium">
                            Добавить цену для топ-мастера
                        </label>
                    </div>
                    {form.hasTopMasterPrice && (
                        <div>
                            <label className="block mb-1 font-medium">Цена топ-мастера (₽)</label>
                            <input 
                                name="priceTopMaster" 
                                value={form.priceTopMaster} 
                                onChange={handleChange} 
                                type="number"
                                className="border p-2 w-full rounded" 
                                placeholder="Введите цену"
                            />
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button 
                            type="submit" 
                            className="bg-black text-white px-4 py-2 rounded"
                        >
                            {isEditing ? 'Сохранить' : 'Добавить'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Отмена
                            </button>
                        )}
                    </div>
                </form>

                {/* Фильтр по категориям */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Фильтр по категории</label>
                    <select 
                        value={selectedCategory} 
                        onChange={handleCategoryFilterChange}
                        className="border p-2 rounded"
                    >
                        <option value="Все">Все категории</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Таблица */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="py-2 px-4">Категория</th>
                                <th className="py-2 px-4">Название</th>
                                <th className="py-2 px-4">Цены</th>
                                <th className="py-2 px-4">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.length > 0 ? (
                                filteredServices.map(service => (
                                    <tr key={service.id} className="border-b">
                                        <td className="py-2 px-4">{service.category}</td>
                                        <td className="py-2 px-4">{service.name}</td>
                                        <td className="py-2 px-4">{parsePrice(service.prices)}</td>
                                        <td className="py-2 px-4 space-x-2">
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-4 text-center text-gray-500">
                                        Услуги не найдены
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
};

export default withAuth(Services);