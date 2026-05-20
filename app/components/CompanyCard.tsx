type Props = {
  id: string;
  companyName: string;
  status: string;
  deadline: string | null;
  onDelete: () => void;
  onUpdate: (
    id: string,
    companyName: string,
    status: string,
    deadline: string
  ) => void;
};

export default function CompanyCard({
  id,
  companyName,
  status,
  deadline,
  onDelete,
  onUpdate,
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

  const getRemainingDays = () => {
    if (!deadline) return null;

    const today = new Date();
    const deadlineDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const remainingDays = getRemainingDays();

  const getDeadlineColor = () => {
    if (remainingDays === null) return "text-gray-700";
    if (remainingDays <= 3) return "text-red-600 font-bold";
    if (remainingDays <= 7) return "text-yellow-600 font-bold";
    return "text-gray-700";
  };

  const getCardBorder = () => {
    if (remainingDays === null) return "border";
    if (remainingDays <= 3) return "border-2 border-red-500";
    if (remainingDays <= 7) return "border-2 border-yellow-500";
    return "border";
  };

  return (
    <div className={`${getCardBorder()} rounded-xl p-4 mt-4`}>
      <input
        className="text-2xl font-bold border p-2 w-full"
        value={companyName}
        onChange={(e) =>
          onUpdate(id, e.target.value, status, deadline ?? "")
        }
      />

      <select
        className={`mt-3 border p-2 rounded ${getStatusColor(status)}`}
        value={status}
        onChange={(e) =>
          onUpdate(id, companyName, e.target.value, deadline ?? "")
        }
      >
        <option value="未応募">未応募</option>
        <option value="ES提出">ES提出</option>
        <option value="一次面接">一次面接</option>
        <option value="最終面接">最終面接</option>
        <option value="内定">内定</option>
        <option value="落選">落選</option>
      </select>

      <div className="mt-3">
        <span className={getDeadlineColor()}>締切日：</span>
        <input
          className="border p-2 ml-2"
          type="date"
          value={deadline ?? ""}
          onChange={(e) =>
            onUpdate(id, companyName, status, e.target.value)
          }
        />
      </div>

      {remainingDays !== null && (
        <p className={`mt-2 ${getDeadlineColor()}`}>
          残り{remainingDays}日
        </p>
      )}

      {remainingDays !== null && remainingDays <= 3 && (
        <p className="mt-2 text-red-600 font-bold">
          3日以内です
        </p>
      )}

      {remainingDays !== null &&
        remainingDays > 3 &&
        remainingDays <= 7 && (
          <p className="mt-2 text-yellow-600 font-bold">
            7日以内です
          </p>
        )}

      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={onDelete}
      >
        削除
      </button>
    </div>
  );
}