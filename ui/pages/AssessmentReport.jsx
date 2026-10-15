import Input from "../atoms/Input";
import Select from "../atoms/Select";

const AssessmentReport = ({ reportId }) => {
  return (
    <section className="space-y-6">
      <div className="flex lg:flex-row gap-3 flex-col justify-between">
        <h2 className="font-bold text-3xl">Assessment Report</h2>
        <div className="w-full lg:w-[35%] grid grid-cols-3 gap-4">
          <span className="col-span-2">
            <Input icon={`ri-search-line`} placeholder={"Search"} />
          </span>
          <Select options={["Filter"]} icon={"ri-filter-2-line"} />
        </div>
      </div>
      <div className="bg-white rounded-xl border  border-quinary">
        <div className="overflow-x-auto py-4">
          <div className="min-w-[1000px] lg:min-w-full">
            <table className="w-full">
              <thead className="bg-white ">
                <tr className="border-b border-quinary">
                  <th>ID's</th>
                  <th>NAME</th>
                  <th>Message</th>
                  <th>Attatchment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-quinary">
                  <td>Admin</td>
                  <td className="text-nowrap">Gurmeet Kaur</td>
                  <td className="text-justify">
                    It appears that your performance input hasn't been updated.
                    Kindly ensure it is updated on a daily basis moving forward.{" "}
                  </td>
                  <td>No</td>
                  <td className="text-nowrap">12 May 2025</td>
                </tr>
                <tr className="border-b border-quinary">
                  <td>Admin</td>
                  <td className="text-nowrap">Gurmeet Kaur</td>
                  <td className="text-justify">
                    It appears that your performance input hasn't been updated.
                    Kindly ensure it is updated on a daily basis moving forward.{" "}
                  </td>
                  <td>No</td>
                  <td className="text-nowrap">12 May 2025</td>
                </tr>
                <tr className="border-b border-quinary">
                  <td>Admin</td>
                  <td className="text-nowrap">Gurmeet Kaur</td>
                  <td className="text-justify">
                    It appears that your performance input hasn't been updated.
                    Kindly ensure it is updated on a daily basis moving forward.{" "}
                  </td>
                  <td>No</td>
                  <td className="text-nowrap">12 May 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentReport;
