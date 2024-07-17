const {
  ConnxPromise,
  OpenPromise,
  PutPromise,
  MQC,
  MQCNO,
  MQOD,
  MQMD,
  MQPMO,
  MQCSP,
  MQCD,
} = require('ibmmq');

const MQ_SERVER_HOSTNAME = ''; // Message queue server hostname (eg. 9.110.182.197)
const TCP_PORT = 1418; // Message queue server port
const QUEUE_MANAGER = 'QM1'; // Queue manager
const QUEUE_NAME = 'DEV.QUEUE.1'; // Queue name
const CHANNEL_NAME = '';
const INPUT_QUEUE = '';
const RNAME = ''; // Dest Queue
const RQMNAME = ''; // Dest QMgr
const TRANSMISSION_QUEUE = '';

const connectionSecurityParams = new MQCSP();

const demo = async () => {
  const channelDefinition = new MQCD();
  channelDefinition.ChannelName = CHANNEL_NAME;
  channelDefinition.ConnectionName = `${MQ_SERVER_HOSTNAME}(${TCP_PORT})`;

  const connectOptions = new MQCNO();
  connectOptions.Options = MQC.MQCNO_CLIENT_BINDING;
  connectOptions.ClientConn = channelDefinition;
  const queueManager = await ConnxPromise(QUEUE_MANAGER, connectOptions);

  const objectDescriptor = new MQOD();
  objectDescriptor.ResolvedQName = RNAME;
  objectDescriptor.ResolvedQMgrName = RQMNAME;
  objectDescriptor.ObjectName = QUEUE_NAME;
  const openOptions = MQC.MQOO_OUTPUT;
  const mqObject = await OpenPromise(
    queueManager,
    objectDescriptor,
    openOptions
  );

  const messageQueueDescriptor = new MQMD();
  const putMessageOptions = new MQPMO();
  putMessageOptions.Options =
    MQC.MQPMO_NO_SYNCPOINT | MQC.MQPMO_NEW_MSG_ID | MQC.MQPMO_NEW_CORREL_ID;
  const messageContent = `<xml></xml>`;
  await PutPromise(
    mqObject,
    messageQueueDescriptor,
    putMessageOptions,
    messageContent
  );
};
