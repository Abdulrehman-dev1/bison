import AdminPagination from '@/Components/Admin/AdminPagination';
import ConfirmModal from '@/Components/Admin/ConfirmModal';
import { IconAction, IconActions } from '@/Components/Admin/IconActions';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function Index({ products }) {
    const [confirm, setConfirm] = useState(null);

    const destroy = () => {
        if (!confirm) return;
        router.delete(route('admin.products.destroy', confirm.id), {
            onFinish: () => setConfirm(null),
        });
    };

    return (
        <AdminLayout
            title="Products"
            actions={
                <Link href={route('admin.products.create')} className="adm-btn adm-btn-copper adm-btn-sm">
                    <Plus size={16} /> Add product
                </Link>
            }
        >
            <Head title="Products" />

            <div className="adm-panel">
                <div className="adm-panel-header">
                    <h2 className="adm-panel-title">All products</h2>
                    <span className="adm-panel-meta">{products.total} total</span>
                </div>
                <div className="adm-panel-body">
                    {products.data.length === 0 ? (
                        <div className="adm-empty">
                            <p>No products yet. Add your first product to get started.</p>
                        </div>
                    ) : (
                        <table className="adm-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Sort</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.data.map((product) => (
                                    <tr key={product.id}>
                                        <td><strong>{product.name}</strong></td>
                                        <td style={{ color: 'var(--adm-muted)' }}>{product.category_slug}</td>
                                        <td>
                                            <span className={`adm-badge ${product.is_active ? 'adm-badge-active' : 'adm-badge-inactive'}`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>{product.sort_order}</td>
                                        <td>
                                            <IconActions>
                                                <IconAction
                                                    href={route('admin.products.edit', product.id)}
                                                    variant="edit"
                                                    label="Edit product"
                                                />
                                                <IconAction
                                                    variant="delete"
                                                    label="Delete product"
                                                    onClick={() => setConfirm(product)}
                                                />
                                            </IconActions>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <AdminPagination paginator={products} />
                </div>
            </div>

            <ConfirmModal
                open={Boolean(confirm)}
                title="Delete product?"
                message={confirm ? `Are you sure you want to delete "${confirm.name}"? This action cannot be undone.` : ''}
                confirmLabel="Delete"
                onConfirm={destroy}
                onCancel={() => setConfirm(null)}
            />
        </AdminLayout>
    );
}
