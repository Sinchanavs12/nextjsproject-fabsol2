const mongoose = require("mongoose");
const { Schema } = mongoose;

const stharaSchema = new Schema({
  name: String,
});

const Sthara = mongoose.model("stharas", stharaSchema);

const entitySchema = new Schema({
  name: String,
  sthara: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Sthara,
  },
});

const Entity = mongoose.model("entities", entitySchema);

const parentEntitySchema = new Schema({
  currentEntity: {
    type: Schema.Types.ObjectId,
    ref: Entity,
  },
  parentEntity: {
    type: Schema.Types.ObjectId,
    ref: Entity,
  },
});

const ParentEntity = mongoose.model("parentEntities", parentEntitySchema);

const cashSchema = new Schema({
  denomination: Number,
  quantity: Number,
  type: String,
});

const Cash = mongoose.model("cashDenominations", cashSchema);

const denominationSchema = new Schema(
  {
    value: Number,
    type: String,
  },
  { timestamps: true }
);

const Denomination = mongoose.model("denominations", denominationSchema);

const denominationAmountSchema = new Schema({
  value: Number,
  type: String,
  quantity: Number,
});

const DenominationAmount = mongoose.model(
  "denominationAmounts",
  denominationAmountSchema
);

const dravyaSchema = new Schema(
  {
    denominationAmounts: [
      {
        type: Schema.Types.ObjectId,
        ref: DenominationAmount,
      },
    ],
  },
  { timestamps: true }
);

const Dravya = mongoose.model("dravyas", dravyaSchema);

const arpanaChequeSchema = new Schema(
  {
    chequeNumber: Number,
    bankName: String,
    amount: Number,
  },
  { timestamps: true }
);

const ArpanaCheque = mongoose.model("arpanaCheques", arpanaChequeSchema);

const SamarpanaChequeSchema = new Schema(
  {
    chequeNumber: String,
    bankName: String,
    chequeDated: String,
    amount: Number,
  },
  { timestamps: true }
);

const SamarpanaCheque = mongoose.model(
  "samarpanaCheques",
  SamarpanaChequeSchema
);

const arpanaCashSchema = new Schema(
  {
    totalCash: [
      {
        type: Schema.Types.ObjectId,
        ref: Cash,
      },
    ],
  },
  { timestamps: true }
);

const ArpanaCash = mongoose.model("arpanaCashes", arpanaCashSchema);

const arpanaSchema = new Schema({
  sangraha: {
    type: Schema.Types.ObjectId,
    ref: ArpanaCheque,
  },
  bankCheques: [
    {
      type: Schema.Types.ObjectId,
      Ref: ArpanaCheque,
    },
  ],
  amount: {
    type: Schema.Types.ObjectId,
    ref: ArpanaCash,
  },
});

const Arpana = mongoose.model("arpana", arpanaSchema);

const addressSchema = new Schema(
  {
    address: String,
    address2: String,
    address3: String,
    pincode: Number,
    upavasati: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    location: String,
  },
  { timestamps: true }
);

const Address = mongoose.model("locations", addressSchema);

const participantSchema = new Schema({
  name: String,
  phone: String,
  email: String,
  sanghaResponsibility: String,
  bloodGroup: String,
  //need a better name
  type: String,
  address: {
    type: Schema.Types.ObjectId,
    ref: "locations",
  },
  work: String,
  coverNumber: Number,
  arpana: {
    type: Schema.Types.ObjectId,
    ref: Arpana,
  },
});

const Participant = mongoose.model("participants", participantSchema);

const ssDataSchema = new Schema(
  {
    name: String,
    phone: String,
    email: String,
    bloodGroup: String,
    currentAddress: {
      type: Schema.Types.ObjectId,
      ref: "locations",
    },
    nativeAddress: {
      type: Schema.Types.ObjectId,
      ref: "locations",
    },
    education: String,
    otherEducation: String,
    profession: String,
    otherProfession: String,
    job: String,
    dob: String,
  },
  { timestamps: true }
);

const SSData = mongoose.model("ssdata", ssDataSchema);

const sanghDataSchema = new Schema(
  {
    shakhe: String,
    itmilan: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    upavasati: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    vasati: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    valay: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    nagar: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    khand: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    bhag: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    vibhag: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    prant: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    sanghaResponsibility: String,
    sanghOrganization: String,
    otherResponsibility: String,
    sanghShikshan: String,
    ssData: {
      type: Schema.Types.ObjectId,
      ref: SSData,
    },
  },
  { timestamps: true }
);

const SanghData = mongoose.model("sanghdata", sanghDataSchema);

const futureTargetSchema = new Schema({
  targetParticipant: Number,
  targetAmount: Number,
  targetParticipantBaalaks: Number,
  targetParticipantTarunas: Number,
  targetParticipantShishu: Number,
  year: Number,
  event: String,
});

const FutureTarget = mongoose.model("goals2024", futureTargetSchema);

const sgpuEventSchema = new Schema({
  name: String,
  title: String,
  vibhag: String,
  bhag: String,
  nagar: String,
  vasati: String,
  upavasati: String,
  shakhe: String,
  eventType: String,
  eventDate: String,
  eventTime: String,
  eventAddress: String,
  speaker: {
    type: Schema.Types.ObjectId,
    ref: Participant,
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: Participant,
  },
  pramukh: {
    type: Schema.Types.ObjectId,
    ref: Participant,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: Participant,
    },
  ],
  futureTarget: {
    type: Schema.Types.ObjectId,
    ref: FutureTarget,
  },
});

const SGPUEvent = mongoose.model("sgpuevents", sgpuEventSchema);

const sgpUtsavSchema = new Schema(
  {
    name: String,
    title: String,
    prant: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    vibhag: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    bhag: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    khand: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    nagar: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    valay: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    vasati: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    upavasati: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    itmilan: {
      type: Schema.Types.ObjectId,
      ref: Entity,
    },
    shakhe: String,
    eventType: String,
    eventDate: String,
    eventTime: String,
    eventAddress: String,
    speaker: {
      type: Schema.Types.ObjectId,
      ref: SSData,
    },
    guest: {
      type: Schema.Types.ObjectId,
      ref: SSData,
    },
    pramukh: {
      type: Schema.Types.ObjectId,
      ref: SSData,
    },
  },
  { timestamps: true }
);

const SGPUtsav = mongoose.model("sgputsavs", sgpUtsavSchema);

const goalsSchema = new Schema(
  {
    targetParticipant: Number,
    targetAmount: Number,
    targetParticipantBaalaks: Number,
    targetParticipantTarunas: Number,
    targetParticipantShishu: Number,
    year: Number,
    sgpUtsav: {
      type: Schema.Types.ObjectId,
      ref: SGPUtsav,
    },
  },
  { timestamps: true }
);

const Goals = mongoose.model("goals", goalsSchema);

const utsavVaradiSchema = new Schema(
  {
    utsav: {
      type: Schema.Types.ObjectId,
      ref: SGPUEvent || SGPUtsav,
    },
    baalaks: Number,
    tarunas: Number,
    shishus: Number,
    poojaks: Number,
    arpaks: Number,
    arpanaBySangraha: Number,
    arpanaByBankCheque: Number,
    arpanaByCash: Number,
    arpanaByBaalaks: Number,
    arpanaByTarunas: Number,
    arpanaByShishus: Number,
    addressEntered: Number,
    baalaksArpana: Number,
    tarunasArpana: Number,
    shishusArpana: Number,
    denom500: Number,
    denom200: Number,
    denom100: Number,
    denom50: Number,
    denom20: Number,
    denom10: Number,
    denom10Coin: Number,
    denom5Coin: Number,
    denom2Coin: Number,
    denom1Coin: Number,
    below100: Number,
    below500: Number,
    above500: Number,
    arpaksBelow100: Number,
    arpaksBelow500: Number,
    arpaksBelow1000: Number,
    arpaksBelow5000: Number,
    arpaksBelow10000: Number,
    arpaks10000AndAbove: Number,
    sangrahaAmount: Number,
    bankChequeAmount: Number,
    cashCollection: Number,
    totalAmount: Number,
  },
  { timestamps: true }
);

const UtsavVaradi = mongoose.model("utsavvaradis", utsavVaradiSchema);

const samarpanSchema = new Schema(
  {
    sgpuEvent: {
      type: Schema.Types.ObjectId,
      ref: SGPUtsav,
    },
    sangraha: {
      type: Schema.Types.ObjectId,
      ref: SamarpanaCheque,
    },
    bankCheques: [
      {
        type: Schema.Types.ObjectId,
        Ref: SamarpanaCheque,
      },
    ],
    amount: {
      type: Schema.Types.ObjectId,
      ref: Dravya,
    },
    ssData: {
      type: Schema.Types.ObjectId,
      ref: SSData,
    },
    coverNumber: Number,
    isArpanaSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Samarpan = mongoose.model("samarpans", samarpanSchema);

const sanghVargSchema = new Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const SanghVarg = mongoose.model("sanghvargs", sanghVargSchema);

const vargRegistrationSchema = new Schema(
  {
    ssId: {
      type: Schema.Types.ObjectId,
      ref: SSData,
    },
    upcomingVarg: {
      type: Schema.Types.ObjectId,
      ref: SanghVarg,
    },
    currentYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    previousVarg: {
      type: Schema.Types.ObjectId,
      ref: SanghVarg,
    },
    yearOfPreviousVarg: {
      type: Number,
    },
  },
  { timestamps: true }
);

const VargRegistration = mongoose.model(
  "vargRegistrations",
  vargRegistrationSchema
);

const eventSchema = new Schema(
  {
    eventName: String,
    eventDate: String,
    eventTime: String,
    eventLocation: String,
    description: String,
    activities: [String],
    eventPramukh: {
      type: Schema.Types.ObjectId,
      ref: "SSData",
    },
    entityPath: {
      prant: {
        type: Schema.Types.ObjectId,
        ref: "Entity",
      },
      vibhag: {
        type: Schema.Types.ObjectId,
        ref: "Entity",
      },
      bhag: {
        type: Schema.Types.ObjectId,
        ref: "Entity",
      },
      nagar: {
        type: Schema.Types.ObjectId,
        ref: "Entity",
      },
      vasati: {
        type: Schema.Types.ObjectId,
        ref: "Entity",
      },
      upavasati: {
        type: Schema.Types.ObjectId,
        ref: "Entity",
      },
    },
    registrationURL: String,
  },
  { timestamps: true }
);

const Event = mongoose.model("events", eventSchema);

const eventRegistrationSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "events",
    },
    name: String,
    phone: String,
    address1: String,
    address2: String,
    address3: String,
    occupation: String,
    upasthiti: Boolean,
  },
  { timestamps: true }
);
const EventRegistration = mongoose.model(
  "eventRegistrations",
  eventRegistrationSchema
);

module.exports = {
  Sthara,
  Entity,
  ParentEntity,
  Address,
  SanghData,
  SSData,
  Participant,
  SGPUEvent,
  SGPUtsav,
  Denomination,
  DenominationAmount,
  Dravya,
  Arpana,
  ArpanaCash,
  ArpanaCheque,
  SamarpanaCheque,
  Cash,
  FutureTarget,
  UtsavVaradi,
  Goals,
  Samarpan,
  SanghVarg,
  VargRegistration,
  Event,
  EventRegistration,
};
