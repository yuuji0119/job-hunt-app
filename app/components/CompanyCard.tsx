type Props = {
  companyName: string;
  status: string;
  deadline: string | null;
  onDelete: () => void;
};

export default function CompanyCard({
  companyName,
  status,
  deadline,
  onDelete,
}: Props) {
  const getStatusColor = (status: string) => {
    if (status === "未応募") return "bg-gray-200 text-gray-800";
    if (status === "ES提出") return "bg-blue-100 text-blue-800";
    if (status === "一次面接") return "bg-green-100 text-green-800";
    if (status === "最終面接") return "bg-purple-100 text-purple-800";
    if (status === "内定") return "bg-yellow-100 text-yellow-800";
    if (status === "落選") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="border rounded-xl p-4 mt-4">
      <h2 className="text-2xl font-bold">{companyName}</h2>

      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
        {status}
      </span>

      <p className="mt-3">
        締切日：{deadline ? deadline : "未設定"}
      </p>

      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={onDelete}
      >
        削除
      </button>
    </div>
  );
}