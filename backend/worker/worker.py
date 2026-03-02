import redis
from rq import Queue
from rq.worker import SimpleWorker

redis_conn = redis.Redis(host="localhost", port=6379, db=0)
queue = Queue(connection=redis_conn)

if __name__ == "__main__":
    worker = SimpleWorker([queue], connection=redis_conn)
    worker.work()
