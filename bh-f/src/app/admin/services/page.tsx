'use client';

import { useEffect, useState } from 'react';
import AdminNavbar from '@/app/components/AdminNavbar';
import withAuth from '@/app/components/withAuth';

const ServicesAdmin = () => {
    const [services, setServices] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Все');
    const [form, setForm] = useState({
        id: null as number | null,
        category_id: '',
        name: '',
        priceMaster: '',
        priceTopMaster: '',
        hasTopMasterPrice: false
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchData = async () => {
            try {
                // Загружаем категории
                const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories?type=service`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const categoriesData = await categoriesRes.json();
                setCategories(categoriesData);

                // Загружаем услуги
                const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const servicesData = await servicesRes.json();
                setServices(servicesData);
                setFilteredServices(servicesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'Все') {
            setFilteredServices(services);
        } else {
            const filtered = services.filter(service => service.category_id === selectedCategory);
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
        if (!token) return;

        try {
            const prices: any = { master: form.priceMaster };
            
            if (form.hasTopMasterPrice && form.priceTopMaster) {
                prices.topMaster = form.priceTopMaster;
            }

            const url = isEditing 
                ? `${process.env.NEXT_PUBLIC_API_URL}/admin/services/${form.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/admin/services`;
            
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    category_id: form.category_id,
                    name: form.name,
                    prices: JSON.stringify(prices)
                })
            });

            if (!response.ok) throw new Error('Ошибка сохранения');

            const updatedServices = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedData = await updatedServices.json();
            
            setServices(updatedData);
            resetForm();
        } catch (e) {
            alert(`Ошибка при ${isEditing ? 'редактировании' : 'добавлении'}`);
        }
    };

    const handleEdit = (service: any) => {
        const prices = typeof service.prices === 'string' ? JSON.parse(service.prices) : service.prices;
        
        setForm({
            id: service.id,
            category_id: service.category_id,
            name: service.name,
            priceMaster: prices.master || '',
            priceTopMaster: prices.topMaster || '',
            hasTopMasterPrice: !!prices.topMaster
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem('token');
        if (!token || !confirm('Удалить услугу?')) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            setServices(services.filter(s => s.id !== id));
        } catch (error) {
            alert('Ошибка при удалении');
        }
    };

    const resetForm = () => {
        setForm({
            id: null,
            category_id: categories.length > 0 ? categories[0].id : '',
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
                            name="category_id" 
                            value={form.category_id} 
                            onChange={handleChange} 
                            className="border p-2 w-full rounded"
                            required
                        >
                            <option value="" disabled>Выберите категорию</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
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
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                                filteredServices.map(service => {
                                    const category = categories.find(c => c.id === service.category_id);
                                    return (
                                        <tr key={service.id} className="border-b">
                                            <td className="py-2 px-4">{category?.name || 'Неизвестно'}</td>
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
                                    );
                                })
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

export default withAuth(ServicesAdmin);