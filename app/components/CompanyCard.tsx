type Props = {
  id: string;
  companyName: string;
  status: string;
  deadline: string | null;
  mypageUrl: string | null;
  loginId: string | null;
  loginPassword: string | null;
  memo: string | null;
  onDelete: () => void;
  onUpdate: (
    id: string,
    companyName: string,
    status: string,
    deadline: string,
    mypageUrl: string,
    loginId: string,
    loginPassword: string,
    memo: string
  ) => void;
};

export default function CompanyCard({
  id,
  companyName,
  status,
  deadline,
  mypageUrl,
  loginId,
  loginPassword,
  memo,
  onDelete,
  onUpdate,
}: Props) {
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
          onUpdate(
            id,
            e.target.value,
            status,
            deadline ?? "",
            mypageUrl ?? "",
            loginId ?? "",
            loginPassword ?? "",
            memo ?? ""
          )
        }
      />

      <select
        className="mt-3 border p-2 rounded"
        value={status}
        onChange={(e) =>
          onUpdate(
            id,
            companyName,
            e.target.value,
            deadline ?? "",
            mypageUrl ?? "",
            loginId ?? "",
            loginPassword ?? "",
            memo ?? ""
          )
        }
      >
        <option value="未応募">未応募</option>
        <option value="ES提出">ES提出</option>
        <option value="一次面接">一次面接</option>
        <option value="最終面接">最終面接</option>
        <option value="内定">内定</option>
        <option value="落選">落選</option>
      </select>

      <input
        className={`border p-2 w-full mt-3 ${getDeadlineColor()}`}
        type="date"
        value={deadline ?? ""}
        onChange={(e) =>
          onUpdate(
            id,
            companyName,
            status,
            e.target.value,
            mypageUrl ?? "",
            loginId ?? "",
            loginPassword ?? "",
            memo ?? ""
          )
        }
      />

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

      <input
        className="border p-2 w-full mt-3"
        placeholder="企業マイページURL"
        value={mypageUrl ?? ""}
        onChange={(e) =>
          onUpdate(
            id,
            companyName,
            status,
            deadline ?? "",
            e.target.value,
            loginId ?? "",
            loginPassword ?? "",
            memo ?? ""
          )
        }
      />

      <input
        className="border p-2 w-full mt-3"
        placeholder="ログインID"
        value={loginId ?? ""}
        onChange={(e) =>
          onUpdate(
            id,
            companyName,
            status,
            deadline ?? "",
            mypageUrl ?? "",
            e.target.value,
            loginPassword ?? "",
            memo ?? ""
          )
        }
      />

      <input
        className="border p-2 w-full mt-3"
        type="password"
        placeholder="パスワード"
        value={loginPassword ?? ""}
        onChange={(e) =>
          onUpdate(
            id,
            companyName,
            status,
            deadline ?? "",
            mypageUrl ?? "",
            loginId ?? "",
            e.target.value,
            memo ?? ""
          )
        }
      />

      <textarea
        className="border p-2 w-full mt-3"
        placeholder="メモ"
        value={memo ?? ""}
        onChange={(e) =>
          onUpdate(
            id,
            companyName,
            status,
            deadline ?? "",
            mypageUrl ?? "",
            loginId ?? "",
            loginPassword ?? "",
            e.target.value
          )
        }
      />

      <div className="mt-4 flex gap-2">
        {mypageUrl && (
          <a
            href={mypageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            マイページ
          </a>
        )}

        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onDelete}
        >
          削除
        </button>
      </div>
    </div>
  );
}