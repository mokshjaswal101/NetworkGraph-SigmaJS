import axios from "axios";
const client = axios.create({
  baseURL: "https://networkgraph-backend.pharmaacuity.com/",
});

//https://networkgraph-backend.pharmaacuity.com/
//"http://pa-v2-api-nlb-3c27031a599085c6.elb.us-east-2.amazonaws.com:3000"

const fetchAllData = async () => {
  try {
    let response = await axios.get(
      "https://network-graph-data.s3.us-east-2.amazonaws.com/project_id_1936e211-b997-11ed-8c61-52d672bc987d/network_graph.json"
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const fetchHcpDetails = async (id) => {
  try {
    let response = await client.get(
      `elastic/getone?uuid=${id}&project_id=1936e211-b997-11ed-8c61-52d672bc987d`
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const fetchAffiliations = async (id) => {
  try {
    let response = await client.get(`/elastic/getaffiliation`);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const fetchCitations = async (id) => {
  try {
    let response = await client.get(`/elastic/getcitation`);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export { fetchAllData, fetchHcpDetails, fetchAffiliations, fetchCitations };
