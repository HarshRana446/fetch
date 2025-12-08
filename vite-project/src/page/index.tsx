import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  dummyId: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [tableState, setTableState] = useState({
    query: "",
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const { query, page, pageSize, totalPages } = tableState;

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    thumbnail: "",
  });

  useEffect(() => {
    fetchProducts();
  }, [query, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const skip = (page - 1) * pageSize;

      const res = await axios.get("http://localhost:6000/v1/product", {
        params: query
          ? { q: query, skip, limit: pageSize }
          : { skip, limit: pageSize },
      });

      setProducts(res.data.products);

      setTableState((prev) => ({
        ...prev,
        totalPages: parseInt(String(res.data.total / prev.pageSize)),
      }));

      setLoading(false);
    } catch {
      toast.error("Failed to load products");
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setTableState((prev) => ({
        ...prev,
        query: value,
        page: 1,
      }));
    }, 600),
    []
  );

  const handleSave = async () => {
    try {
      if (editingProduct) {
        await axios.put("http://localhost:6000/v1/product", {
          ...formData,
          _id: editingProduct._id,
        });
        toast.success("Updated!");
      } else {
        await axios.post("http://localhost:6000/v1/product", formData);
        toast.success("Created!");
      }

      setShowModal(false);
      fetchProducts();
    } catch {
      toast.error("Error saving product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete("http://localhost:6000/v1/product", {
        data: { _id: id },
      });
      toast.success("Deleted successfully!");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <input
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder="Search by title"
          className="border p-2 rounded w-64"
        />

        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              title: "",
              description: "",
              price: 0,
              thumbnail: "",
            });
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Thumbnail</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="text-center">
                <td className="border p-2">{p.dummyId}</td>
                <td className="border p-2">
                  <img src={p.thumbnail} className="w-16 h-16 mx-auto" />
                </td>
                <td className="border p-2">{p.title}</td>
                <td className="border p-2">${p.price}</td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setFormData(p);
                      setShowModal(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() =>
            setTableState((prev) => ({ ...prev, page: prev.page - 1 }))
          }
          className="p-2 bg-gray-300 rounded"
        >
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() =>
            setTableState((prev) => ({ ...prev, page: prev.page + 1 }))
          }
          className="p-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl mb-4">
              {editingProduct ? "Edit" : "Add"} Product
            </h2>

            <input
              className="border p-2 w-full mb-2"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData((f) => ({ ...f, title: e.target.value }))
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((f) => ({ ...f, description: e.target.value }))
              }
            />

            <input
              className="border p-2 w-full mb-2"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData((f) => ({ ...f, price: Number(e.target.value) }))
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Thumbnail URL"
              value={formData.thumbnail}
              onChange={(e) =>
                setFormData((f) => ({ ...f, thumbnail: e.target.value }))
              }
            />

            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
