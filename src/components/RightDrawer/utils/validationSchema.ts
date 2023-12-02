import { array, boolean, number, object, string } from "yup";
import { phonePrefixs } from "../../../configuration/phonePrefixs";

const initialValues = {
  useSMS: false,
  name: "",
  partySize: "1",
  phonePrefix: phonePrefixs[0].id,
  phoneNumber: "",
  deviceId: null as number | null,
  priorities: [] as number[],
  observations: "",
  estimatedTime: "",
  verifyCode: "",
  id: null as number | null,
};

const validationSchema = object({
  useSMS: boolean(),
  name: string().max(50),
  partySize: string().max(3),
  phonePrefix: string(),
  phoneNumber: string().max(11),
  deviceId: number().nullable(),
  priorities: array(number()),
  observations: string(),
  estimatedTime: string(),
  verifyCode: string().max(6),
  id: number().nullable(),
});

export { initialValues, validationSchema };
